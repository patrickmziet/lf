# OpenAI/AI API imports
import openai
from openai import OpenAI
import os
import json
# LLM management package
from pana import ModelFactory
#from pana.lparse import parse_json_string
# Local imports
from .models import Flashcard


def parse_json_string(json_string):
    try:
        flashcards = json.loads(json_string)
        flashcards = {int(k): v for k, v in flashcards.items()}
        return flashcards
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}


def gen_flashcards(msg_chn, topic_id, start, end, max_tokens=1000):
    try:
        print("About to establish connection")
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        print("Established connection with OpenAI")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            response_format={"type": "json_object"},
            messages=msg_chn,
            max_tokens=max_tokens,
        )
    except openai.APIConnectionError as e:
        print("The server could not be reached")
        print(e.__cause__)  # an underlying Exception, likely raised within httpx.
    except openai.RateLimitError as e:
        print("A 429 status code was received; we should back off a bit.")
    except openai.APIStatusError as e:
        print("Another non-200-range status code was received")
        print(e.status_code)
        print(e.response)    
    print(response.choices[0].message.content)
    parsed_flashcards = parse_json_string(response.choices[0].message.content)
    for card_number, card in parsed_flashcards.items():
        Flashcard.objects.create(
            topic_id=topic_id,
            question=card['Question'],
            answer=card['Answer'],
            start_end=f"{start}-{end}"
        )
        
                
def generate_flashcards(msg_chn, topic_id, start, end):   
    model = ModelFactory.get_model("gpt-3.5-turbo-0125", 
                                   api_key=os.environ.get("OPENAI_API_KEY"))
    try:
        response = model.make_call(msg_chn)
    except Exception as e:
        print(e)
        return
    print(response.choices[0].message.content)
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


# Potentially redundant code below
def extract_text_between_markers(input_string):
    pattern = r'(?<=BEGIN)(.*?)(?=END)'
    matches = re.finditer(pattern, input_string, re.DOTALL)
    x = [match.group(1).strip() for match in matches]
    return x[0]
