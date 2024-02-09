# OpenAI/AI API imports
from openai import OpenAI
import os
# LLM management package
from pana.models import ModelFactory
from pana.lparse import parse_json_string
# Local imports
from .models import Flashcard


def generate_flashcards(msg_chn, topic_id):   
    model = ModelFactory.get_model("gpt-3.5-turbo-0125", api_key=os.environ.get("OPENAI_API_KEY"))
    response = model.make_call(msg_chn)
    parsed_flashcards = parse_json_string(response.choices[0].message.content)
    for card_number, card in parsed_flashcards.items():
        Flashcard.objects.create(
            topic_id=topic_id,
            question=card['Question'],
            answer=card['Answer'],
        )
    # YOU ARE HERE, NEED TO ADJUST HOW MSG_CHN IS MADE, DO JSON VERSION
    
    # Generate initial batch of flashcards
    # This is a very naive implementation
"""     client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

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
 """
 
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


