from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import exception_handler

from core.models import Message
from core.serializers import MessageSerializer


class MessageApiView(RetrieveAPIView):
    serializer_class = MessageSerializer
    text = None

    def get_object(self):
        return Message(text=self.text)


class PublicMessageApiView(MessageApiView):
    text = "This is a public message."


class ProtectedMessageApiView(MessageApiView):
    text = "This is a protected message."
    permission_classes = [IsAuthenticated]


class AdminMessageApiView(MessageApiView):
    text = "This is an admin message."
    permission_classes = [IsAuthenticated]


def api_exception_handler(exc, context=None):
    response = exception_handler(exc, context=context)
    if response and isinstance(response.data, dict):
        response.data = {'message': response.data.get('detail', 'API Error')}
    elif response is not None:
        response.data = {'message': 'API Error'}
    return response


from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile, File
from PyPDF2 import PdfReader
from docx import Document as DocxDoc
from io import BytesIO
import openai
from openai import OpenAI
import os
from .models import Note, User, Topic, Document, Flashcard
from .serializers import NoteSerializer, UserSerializer, TopicSerializer, DocumentSerializer, FlashcardSerializer


class CreateUserIfNotExistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Try to get the user first
        try:
            user = User.objects.get(
                id=request.data.get('id'),
                sub=request.data.get('sub'),
                email=request.data.get('email')
            )
            return Response({"message": "User already exists"}, status=200)
        except User.DoesNotExist:
            # If the user does not exist, proceed with serializer validation and creation
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


class TopicListCreateAPIView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        User = get_user_model()
        user = User.objects.get(id=self.request.user.id.split('|')[1])
        serializer.save(user=user)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user.id.split('|')[1])


class TopicDocumentsAPIView(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return Document.objects.filter(topic_id=topic_id)
    
class TopicDestroyAPIView(generics.DestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user.id.split('|')[1])

class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        topic_id = request.data['topic']
        topic = Topic.objects.get(id=topic_id)
        combined_content = ""
        file_cnt = 0
        for file in request.FILES.getlist('documents'):
            Document.objects.create(topic=topic, document=file)
            file.seek(0)
            file_cnt += 1
            combined_content += "START of Document " + str(file_cnt) + ": " + file.name + "\n"
            if file.name.endswith('.txt'):
                file_content = file.read().decode('utf-8')
            elif file.name.endswith('.pdf'):
                pdf = PdfReader(file)
                file_content = "\n".join(page.extract_text() for page in pdf.pages)
            elif file.name.endswith('.docx'):
                doc = DocxDoc(BytesIO(file.read()))
                file_content = "\n".join(para.text for para in doc.paragraphs)
            else:
                return Response({"error": "Unsupported file format"}, status=400)
            combined_content += file_content + "\n"
            combined_content += "END of Document " + str(file_cnt) + ": " + file.name + "\n"

        print(combined_content)
        combined_file = ContentFile(combined_content.encode('utf-8'), name='combined_file.txt')
        # Generate initial batch of flashcards
        initial_flashcards(combined_content, topic_id=topic_id, num_cards=4)
        Document.objects.create(topic=topic, document=File(combined_file))

        return Response(status=204)


class FlashcardListCreateAPIView(generics.ListCreateAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        User = get_user_model()
        user = User.objects.get(id=self.request.user.id.split('|')[1])
        serializer.save(user=user)
    
    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return self.queryset.filter(topic_id=topic_id)


class FlashcardUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_flashcards = request.data

        for updated_flashcard in updated_flashcards:
            try:
                flashcard = Flashcard.objects.get(id=updated_flashcard['id'])
                for key, value in updated_flashcard.items():
                    setattr(flashcard, key, value)
                flashcard.save()
            except Flashcard.DoesNotExist:
                return Response({"error": "Flashcard not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Flashcards updated successfully"}, status=status.HTTP_200_OK)


def initial_flashcards(text, topic_id, num_cards=4):
    # Generate initial batch of flashcards
    # This is a very naive implementation
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )

    msg_chn = [
        {"role": "system", "content": system_message.format(card_axioms=card_axioms, card_format=card_format)},
        {"role": "user", "content": supply_example_text.format(example_text=example_text)},
        {"role": "assistant", "content": example_flashcards},
        {"role": "user", "content": ask_for_flashcards.format(sample_text=text, num_cards=num_cards)},
    ]

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
    for flashcard in Flashcard.objects.filter(topic_id=topic_id):
        print(flashcard.to_json())

# Functions to be used in getting the flashcards
import math
import re

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



class NoteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Note.objects.all() # perhaps very inefficient?
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        User = get_user_model()
        user = User.objects.get(id=self.request.user.id.split('|')[1])
        serializer.save(user=user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user.id.split('|')[1])



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