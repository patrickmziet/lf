import time
import json
from django.core.cache import cache

HEADROOM_PROP = 0.05  # Leave some headroom to avoid hitting rate limits
GPT35_TURBO_TPM = int(160000 * HEADROOM_PROP)  # Tokens per minute
GPT35_TURBO_RPM = int(5000 * HEADROOM_PROP)  # Requests per minute
PAGE_TO_CARDS = {
    (1, 2): 15,
    (2, 5): 30,
    (5, 10): 50,
    (10, 15): 65,
    (15, 30): 75,
    (30, 40): 90,
    (40, 50): 100
}


def check_and_update_rate_limits(tokens_needed):
    """
    Check if the request can proceed without exceeding rate limits.
    Updates the counters in Redis if the request can proceed.

    Args:
        tokens_needed (int): Number of tokens required for the request.

    Returns:
        bool: True if the request can proceed, False otherwise.
    """
    current_time = int(time.time())
    request_key = f"requests:{current_time // 60}"  # unique key for each minute
    token_key = f"tokens:{current_time // 60}"

    # Get the current counts from Redis
    current_requests = cache.get(request_key, 0)
    current_tokens = cache.get(token_key, 0)
    print(f"Current requests: {current_requests}, Current tokens: {current_tokens}")
    
    print(f"Current requests: {current_requests} vs limit {GPT35_TURBO_RPM}, Current tokens: {current_tokens} vs limit {GPT35_TURBO_TPM}")
    # Check if adding this request would exceed the limits
    if current_requests + 1 <= GPT35_TURBO_RPM and current_tokens + tokens_needed <= GPT35_TURBO_TPM:
        # Update Redis with the new counts
        cache.set(request_key, current_requests + 1, timeout=75)  # Expires in 75 seconds
        cache.set(token_key, current_tokens + tokens_needed, timeout=75)
        return True
    else:
        return False

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


def parse_json_string(json_string):
    try:
        flashcards = json.loads(json_string)
        flashcards = {int(k): v for k, v in flashcards.items()}
        return flashcards
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}