import math
import re
import json

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

def parse_json_string(json_string):
    try:
        flashcards = json.loads(json_string)
        flashcards = {int(k): v for k, v in flashcards.items()}
        return flashcards
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}
