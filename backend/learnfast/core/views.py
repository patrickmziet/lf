# Django imports
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler
from rest_framework.parsers import MultiPartParser
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile, File
# File processing imports
from PyPDF2 import PdfReader
from docx import Document as DocxDoc
from io import BytesIO
# General imports
import math
import re
import numpy as np
import tiktoken
# Local imports
from .models import User, Topic, Document, Flashcard
from .serializers import (
    UserSerializer, 
    TopicSerializer, 
    DocumentSerializer, 
    FlashcardSerializer
    )
from .LLMs import generate_flashcards
#from pana import PromptFlow
#from pana.texts import (
#    json_system_message,
#    json_card_format,
#    card_axioms,
#    supply_example_text,
#    nato_text_short,
#    json_nato_flashcards,
#    ask_for_flashcards,
#    ask_for_more,
#)
from .pana_local.pflow import PromptFlow
from .pana_local.texts import (
    json_system_message,
    json_card_format,
    card_axioms,
    supply_example_text,
    nato_text_short,
    json_nato_flashcards,
    ask_for_flashcards,
    ask_for_more,
)

# Global variables
NUM_CARDS = 8
NUM_CARDS_MORE = 10
MIN_POOR_FLASHCARDS = 3
TOKENS_PER_PAGE = 600
GPT35_TURBO_CONTEXT = 16385 - 500 # For saftey to avoid 16k token limit
TOKENS_PER_CARD = 40 # +- 30 tokens with extra 10 for a buffer
PAGE_TO_CARDS = {
    (1, 2): 15,
    (2, 5): 30,
    (5, 10): 50,
    (10, 15): 65,
    (15, 30): 75,
    (30, 40): 90,
    (40, 50): 100
}

def get_rec_cards(num_pages):
    # Make sure num_pages > 1 and throw error if not
    if num_pages < 1:
        return "Pages must be at least 1."
    
    if num_pages >= 50:
        return max(100, num_pages)
    
    for page_range, cards in PAGE_TO_CARDS.items():
        if page_range[0] <= num_pages < page_range[1]:
            return cards
    return "Invalid number of pages"  # In case the number is below 1


def extract_text_between_markers(input_string):
    pattern = r'(?<=BEGIN)(.*?)(?=END)'
    matches = re.finditer(pattern, input_string, re.DOTALL)
    x = [match.group(1).strip() for match in matches]
    return x[0]

def api_exception_handler(exc, context=None):
    response = exception_handler(exc, context=context)
    if response and isinstance(response.data, dict):
        response.data = {'message': response.data.get('detail', 'API Error')}
    elif response is not None:
        response.data = {'message': 'API Error'}
    return response


class IsAuthenticatedUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get_user(self):
        User = get_user_model()
        return User.objects.get(id=self.request.user.id.split('|')[1])


class CreateUserIfNotExistView(IsAuthenticatedUserView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
        
        user_data = request.data
        user, created = User.objects.get_or_create(
            defaults=user_data,
            **{field: user_data[field] for field in ['id', 'sub', 'email'] if field in user_data}
        )
        status_code = 201 if created else 200
        return Response({"message": "User created" if created else "User exists"}, 
                        status=status_code)    


class TopicListCreateAPIView(IsAuthenticatedUserView, generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.get_user())
    
    def get_queryset(self):
        return self.queryset.filter(user=self.get_user())


class TopicDestroyAPIView(TopicListCreateAPIView, generics.DestroyAPIView):
    pass


class TopicDocumentsAPIView(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return Document.objects.filter(topic_id=topic_id)


class TopicRetrieveAPIView(IsAuthenticatedUserView, generics.RetrieveAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.get_user())


class DocumentUploadView(IsAuthenticatedUserView, APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        topic_id = request.data['topic']
        topic = Topic.objects.get(id=topic_id)
        combined_content = ""
        file_cnt = 0
        for file in request.FILES.getlist('documents'):
            if not file.name.endswith(('.txt', '.pdf', '.docx')):
                return Response({"error": f"Unsupported file format: {file.name}. Only .txt, .pdf, and .docx are supported."}, status=400)
            Document.objects.create(topic=topic, document=file)
            file.seek(0)
            file_cnt += 1
            combined_content += self.process_file(file, file_cnt)
        combined_file = ContentFile(combined_content.encode('utf-8'), name='combined_file.txt')
        Document.objects.create(topic=topic, document=File(combined_file))
        self.initialize_flashcards(combined_content, topic_id)
        return Response(status=204)

    def process_file(self, file, file_cnt):
        content = "START of Document " + str(file_cnt) + ": " + file.name + "\n"
        if file.name.endswith('.txt'):
            file_content = file.read().decode('utf-8')
        elif file.name.endswith('.pdf'):
            pdf = PdfReader(file)
            file_content = "\n".join(page.extract_text() for page in pdf.pages)
        elif file.name.endswith('.docx'):
            doc = DocxDoc(BytesIO(file.read()))
            file_content = "\n".join(para.text for para in doc.paragraphs)
        content += file_content + "\n"
        content += "END of Document " + str(file_cnt) + ": " + file.name + "\n"
        return content

    def initialize_flashcards(self, content, topic_id):
        msg_chn = PromptFlow("json_flow", "Basic flow with JSON output")
        msg_chn.add_system_message(json_system_message.format(card_axioms=card_axioms, 
                                                              json_card_format=json_card_format))
        msg_chn.add_interaction("user", supply_example_text.format(example_text=nato_text_short))
        msg_chn.add_interaction("assistant", json_nato_flashcards)
        msg_chn.save_to_file()
        # Compute number of tokens in the content
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        print("Encoding created.")
        tokens_preamble = encoding.encode(''.join(msg['content'] for msg in msg_chn.flow))
        print("Preamble tokens encoded:", tokens_preamble)
        tokens_content = encoding.encode(content)
        print("Length of content tokens encoded:", len(tokens_content))
        print("Content tokens encoded:", tokens_content)
        working_context = GPT35_TURBO_CONTEXT - len(tokens_preamble)
        print("Working context:", working_context)
        num_pages = len(tokens_content) / TOKENS_PER_PAGE
        print("Number of pages:", num_pages)
        total_rec_cards = get_rec_cards(num_pages)
        print("Total recommended cards:", total_rec_cards)
        num_batches = max(round((len(tokens_content) + total_rec_cards * TOKENS_PER_CARD) / working_context), 1)        
        print("Number of batches:", num_batches)
        cards_per_batch = math.floor(total_rec_cards / num_batches)
        print("Cards per batch:", cards_per_batch)
        remaining_cards = total_rec_cards % num_batches
        cards_in_first_batch = cards_per_batch + remaining_cards
        # Verify if the total number of cards is correct
        total_cards = cards_in_first_batch + (cards_per_batch * (num_batches - 1))
        if total_cards != total_rec_cards:
            raise ValueError("Mismatch in the total number of flashcards calculated.")
        
        for i in range(num_batches):
            context_i = working_context - (cards_per_batch * TOKENS_PER_CARD) 
            if i == 0:
                context_i = working_context - (cards_in_first_batch * TOKENS_PER_CARD)
            start = i * context_i
            end = (i + 1) * context_i
            batch_content = encoding.decode(tokens_content[start:end])
            print("Batch content:", batch_content)
            msg_chn.add_interaction("user", ask_for_flashcards.format(sample_text=batch_content, 
                                                                      num_cards=cards_in_first_batch if i == 0 else cards_per_batch))
            print("Message flow:", msg_chn.flow)
            generate_flashcards(msg_chn.flow, topic_id)


class FlashcardListCreateAPIView(IsAuthenticatedUserView, generics.ListCreateAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.get_user())
    
    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return self.queryset.filter(topic_id=topic_id)


class FlashcardUpdateAPIView(IsAuthenticatedUserView):
    def post(self, request):
        updated_flashcards = request.data
        for updated_flashcard in updated_flashcards:
            try:
                flashcard = Flashcard.objects.get(id=updated_flashcard['id'])
                for key in ['question', 'answer', 'easiness', 'interval', 'repetitions', 'record', 'due_date', 'updated_at']:
                    if key in updated_flashcard:
                        setattr(flashcard, key, updated_flashcard[key])
                flashcard.save()
            except Flashcard.DoesNotExist:
                return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Flashcards updated successfully"}, status=status.HTTP_200_OK)


class FlashcardMoreAPIView(IsAuthenticatedUserView):
    def get(self, request, *args, **kwargs):
        updated_flashcards = request.data
        topic_id = self.kwargs['topic_id']
        topic = Topic.objects.get(id=topic_id)
        for updated_flashcard in updated_flashcards:
            try:
                flashcard = Flashcard.objects.get(id=updated_flashcard['id'])
                for key in ['question', 'answer', 'easiness', 'interval', 'repetitions', 'record', 'due_date', 'updated_at']:
                    if key in updated_flashcard:
                        setattr(flashcard, key, updated_flashcard[key])
                flashcard.save()
            except Flashcard.DoesNotExist:
                return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the combined text file that's already been created
        combined_file = Document.objects.filter(topic=topic, document__endswith='combined_file.txt').first()
        combined_file = combined_file.document.read().decode('utf-8')

        # fetch flashcards
        flashcards = Flashcard.objects.filter(topic=topic)
        flashcards_json = {i+1: f.to_json_card() for i, f in enumerate(flashcards)}
        calculate_score = lambda record: round(sum([int(i) for i in record]) / len(record) * 100, 2) if record else 0
        score_array = np.array([calculate_score(f.record) for f in flashcards])
        pctl = np.percentile(score_array, 25)
        poor_flashcards_indices = np.where(score_array <= pctl)[0]
        if len(poor_flashcards_indices) >= MIN_POOR_FLASHCARDS:
            poor_flashcards = {k+1: flashcards_json[k+1] for k in poor_flashcards_indices}
        else:
            poor_flashcards = flashcards_json
        
        msg_chn = PromptFlow.load_from_file("json_flow")
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        tokens_preamble = encoding.encode(''.join(msg['content'] for msg in msg_chn.flow))
        tokens_content = encoding.encode(combined_file)
        working_context = GPT35_TURBO_CONTEXT - len(tokens_preamble)
        
        num_batches = max(round(len(tokens_content) / working_context), 1)
        
        for i in range(num_batches):
            start = i * working_context
            end = (i + 1) * working_context
            batch_content = encoding.decode(tokens_content[start:end])
            msg_chn.add_interaction("user", ask_for_more.format(num_cards=NUM_CARDS_MORE, 
                                                            focus_cards=poor_flashcards,
                                                            card_format=json_card_format, 
                                                            card_axioms=card_axioms,
                                                            text=batch_content))
            generate_flashcards(msg_chn.flow, topic_id)
            
        flashcards = Flashcard.objects.filter(topic_id=topic_id)
        serializer = FlashcardSerializer(flashcards, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FlashcardDestroyAPIView(IsAuthenticatedUserView, generics.DestroyAPIView):
    queryset = Flashcard.objects.all()

    def get_queryset(self):
        return self.queryset.filter(topic__user=self.get_user())

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Flashcard deleted successfully"}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()
