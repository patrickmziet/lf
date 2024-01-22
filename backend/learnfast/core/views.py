# Django imports
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile, File
# File processing imports
from PyPDF2 import PdfReader
from docx import Document as DocxDoc
from io import BytesIO
# OpenAI/AI API imports
from openai import OpenAI
# General imports
import os
import math
import re
# Local imports
from .models import User, Topic, Document, Flashcard
from .serializers import (
    UserSerializer, 
    TopicSerializer, 
    DocumentSerializer, 
    FlashcardSerializer
    )

# Global variables
NUM_CARDS = 4
NUM_CARDS_MORE = 4

# Prompt templates
card_axioms = """
- Most flash cards should be atomic, i.e. they focus on a single piece of information.
- Make sure that that some of the flash cards are trivial so that users are able to build up key context on the topic.
- Avoid isolated flash cards which are not connected to other flash cards, that is ensure that the flash cards are connected to each other in such a way that when taken together they build up understanding.
- Do not, under any circumstances, make flash cards containing information which is not found in the provived text.
- The flash cards should be less than 8 words long.
"""

card_format = """
- Flash card X:
-- Question: Y
-- Answer: Z

Where X is the number of the flash card, Y is the question and Z is the answer. 
"""

system_message = """
You are a helpful study assistant. I want you to create flash cards to be used for studying. The cards should obey these axioms:

{card_axioms}

and have this format:

{card_format}

where X is the number of the flash card, Y is the question and Z is the answer.
"""

supply_example_text = """

Here is an example text:

"{example_text}"

Make 6 flash cards from this text.
"""

example_text = """
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  

Last year COVID-19 kept us apart. This year we are finally together again. 

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. 

With a duty to one another to the American people to the Constitution. 

And with an unwavering resolve that freedom will always triumph over tyranny. 

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. 

He thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. 

He met the Ukrainian people. 

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world. 

Groups of citizens blocking tanks with their bodies. Everyone from students to retirees teachers turned soldiers defending their homeland. 

In this struggle as President Zelenskyy said in his speech to the European Parliament “Light will win over darkness.” The Ukrainian Ambassador to the United States is here tonight. 

Let each of us here tonight in this Chamber send an unmistakable signal to Ukraine and to the world. 

Please rise if you are able and show that, Yes, we the United States of America stand with the Ukrainian people. 

Throughout our history we’ve learned this lesson when dictators do not pay a price for their aggression they cause more chaos.   

They keep moving.   

And the costs and the threats to America and the world keep rising.   

That’s why the NATO Alliance was created to secure peace and stability in Europe after World War 2. 

The United States is a member along with 29 other nations. 
"""

example_flashcards = """
- Flash card 1:
-- Question: How many members are in the NATO Alliance?
-- Answer: 30
- Flash card 2:
-- Question: What is the name of the Ukrainian President?
-- Answer: Volodymyr Zelenskyy
- Flash card 3:
-- Question: Who did the speaker of this speech greet first?
-- Answer: Madam Speaker
- Flash card 4:
-- Question: Why was, according to the speaker, was NATO created?
-- Answer: To secure peace in Europe after WW2.
- Flash card 5:
-- Question: Who from Russia is repsonsible for the invasion?
-- Answer: Vladimir Putin
- Flash card 6:
-- Question: How many days before the speech did the invasion happen?
-- Answer: 6 days
"""

ask_for_flashcards = """

Here is the text I want you to create flash cards from:

"{sample_text}"

Now provide {num_cards} flash cards on the above information. 

"""

ask_for_more = """
Now provide {num_cards} more unique flash cards with card format:

{card_format}

and card axioms:

{card_axioms}

However, note the score on the already listed flashcards. This is the percentage of times the user has answered the flashcard correctly. Focus on generating flashcards which will help the user better understand topics with lower scores (< 80%).
"""

# Helper functions
def generate_list(x, max_num):
    quotient = math.floor(x / max_num)
    remainder = x % max_num
    return [max_num] * quotient + ([remainder] if remainder != 0 else [])

def extract_text_between_markers(input_string):
    pattern = r'(?<=BEGIN)(.*?)(?=END)'
    matches = re.finditer(pattern, input_string, re.DOTALL)
    x = [match.group(1).strip() for match in matches]
    return x[0]

def parse_flashcards(text):
    flashcards = {}
    # Split text into lines
    lines = text.split('\n')
    # Find the flash card lines
    for i, line in enumerate(lines):
        if line.startswith('- Flash card'):
            card_number = int(line.split()[3].rstrip(':'))
            question_line = lines[i+1].strip()
            answer_line = lines[i+2].strip()

            question_text = question_line.split(': ', 1)[1]
            answer_text = answer_line.split(': ', 1)[1]
            
            flashcards[card_number] = {'Question': question_text, 'Answer': answer_text}
    
    return flashcards

def generate_flashcards(msg_chn, topic_id):
    # Generate initial batch of flashcards
    # This is a very naive implementation
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=msg_chn    
    )
    
    parsed_flashcards = parse_flashcards(response.choices[0].message.content)
    for card_number, card in parsed_flashcards.items():
        Flashcard.objects.create(
            topic_id=topic_id,
            question=card['Question'],
            answer=card['Answer'],
        )
    # Print Debugging
    for flashcard in Flashcard.objects.filter(topic_id=topic_id):
        print(flashcard.to_json())



class IsAuthenticatedUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get_user(self):
        User = get_user_model()
        return User.objects.get(id=self.request.user.id.split('|')[1])


class CreateUserIfNotExistView(IsAuthenticatedUserView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user, created = User.objects.get_or_create(
                defaults=serializer.validated_data,
                **{field: serializer.validated_data[field] for field in ['id', 'sub', 'email'] if field in serializer.validated_data}
            )
            status_code = 201 if created else 200
            return Response({"message": "User created" if created else "User exists"}, 
                            status=status_code)
        return Response({"Serializer errors": serializer.errors, 
                         "Valid serializer": False}, status=400)
    

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
        msg_chn = [
            {"role": "system", "content": system_message.format(card_axioms=card_axioms, card_format=card_format)},
            {"role": "user", "content": supply_example_text.format(example_text=example_text)},
            {"role": "assistant", "content": example_flashcards},
            {"role": "user", "content": ask_for_flashcards.format(sample_text=content, num_cards=NUM_CARDS)},
        ]

        generate_flashcards(msg_chn, topic_id)


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
        user = self.get_user()
        # Print debugging
        print(f"The flashcards to update: {updated_flashcards}")
        for updated_flashcard in updated_flashcards:
            try:
                # Print Debugging
                print(f"Updated flashcard: {updated_flashcard}")
                flashcard = Flashcard.objects.get(id=updated_flashcard['id'], user=user)
                for key in ['question', 'answer', 'easiness', 'interval', 'repetitions', 'record', 'due_date', 'updated_at']:
                    if key in updated_flashcard:
                        # Print debugging
                        print(f"Previous value of {key}: {getattr(flashcard, key)}")
                        # Print debugging
                        print(f"New value of {key}: {updated_flashcard[key]}")
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
        # Print debugging
        print(f"The flashcards to update: {updated_flashcards}")
        for updated_flashcard in updated_flashcards:
            try:
                # Print Debugging
                print(f"Updated flashcard: {updated_flashcard}")
                flashcard = Flashcard.objects.get(id=updated_flashcard['id'])
                for key in ['question', 'answer', 'easiness', 'interval', 'repetitions', 'record', 'due_date', 'updated_at']:
                    if key in updated_flashcard:
                        # Print debugging
                        print(f"Previous value of {key}: {getattr(flashcard, key)}")
                        # Print debugging
                        print(f"New value of {key}: {updated_flashcard[key]}")
                        setattr(flashcard, key, updated_flashcard[key])
                flashcard.save()
            except Flashcard.DoesNotExist:
                return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the combined text file that's already been created
        combined_file = Document.objects.filter(topic=topic, document__endswith='combined_file.txt').first()
        # Print debugging
        print(f"Combined file pre-decode: {combined_file}")
        combined_file = combined_file.document.read().decode('utf-8')
        # Print debugging
        print(f"Combined file post-decode: {combined_file}")

        # fetch flashcards
        flashcards = Flashcard.objects.filter(topic=topic)
        flashcard_strings = []
        for flashcard in flashcards:
            record_array = [int(i) for i in flashcard.record]
            # Print debugging
            print(f"Record array: {record_array}")
            score = round(sum(record_array) / len(record_array) * 100, 2) if record_array else 0
            flashcard_string = f"""
                - Flash card {flashcard.id}:
                -- Question: {flashcard.question}
                -- Answer: {flashcard.answer}
                -- Score: {score}%
                """
            # Print debugging
            print(f"Flashcard string: {flashcard_string}")
            flashcard_strings.append(flashcard_string)
        flashcards_string = "\n".join(flashcard_strings)
        # Print debugging
        print(f"Full Flashcards string: {flashcards_string}")
        
        # Reconstruct the msg_chn
        msg_chn = [
            {"role": "system", "content": system_message.format(card_axioms=card_axioms, card_format=card_format)},
            {"role": "user", "content": supply_example_text.format(example_text=combined_file)},
            {"role": "assistant", "content": flashcards_string},
            {"role": "user", "content": ask_for_flashcards.format(sample_text=combined_file, num_cards=NUM_CARDS)},
            {"role": "assistant", "content": flashcards_string},
            {"role": "user", "content": ask_for_more.format(num_cards=NUM_CARDS_MORE, card_format=card_format, card_axioms=card_axioms)},
        ]

        generate_flashcards(msg_chn, topic_id)        
        flashcards = Flashcard.objects.filter(topic_id=topic_id)
        serializer = FlashcardSerializer(flashcards, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FlashcardDestroyAPIView(IsAuthenticatedUserView, generics.DestroyAPIView):
    queryset = Flashcard.objects.all()

    def get_queryset(self):
        return self.queryset.filter(topic__user=self.get_user())

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        print(f"Deleting flashcard with ID: {instance.id}")
        self.perform_destroy(instance)
        print(f"Deleted flashcard with ID: {instance.id}")
        return Response({"message": "Flashcard deleted successfully"}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()