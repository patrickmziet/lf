# OpenAI/AI API imports
from openai import OpenAI
import os
# LLM management package
from pana import ModelFactory
from pana.lparse import parse_json_string
# Local imports
from .models import Flashcard


def generate_flashcards(msg_chn, topic_id, start, end):   
    model = ModelFactory.get_model("gpt-3.5-turbo-0125", 
                                   api_key=os.environ.get("OPENAI_API_KEY"))
    try:
        response = model.make_call(msg_chn)
    except Exception as e:
        print(e)
        return
    parsed_flashcards = parse_json_string(response.choices[0].message.content)
    for card_number, card in parsed_flashcards.items():
        Flashcard.objects.create(
            topic_id=topic_id,
            question=card['Question'],
            answer=card['Answer'],
            start_end=f"{start}-{end}"
        )


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