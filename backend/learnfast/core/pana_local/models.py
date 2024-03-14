from abc import ABC, abstractmethod
from openai import OpenAI
import ollama


class Model(ABC):
    def __init__(self, model_name, api_key=None):
        self.model_name = model_name
        self.api_key = api_key

    @abstractmethod
    def make_call(self, prompt, **kwargs):
        pass

    def get_metadata(self):
        return {
            "model_name": self.model_name
        }


class GPT35Turbo(Model):
    def __init__(self, api_key):
        super().__init__("gpt-3.5-turbo", api_key=api_key)
        
    def make_call(self, prompt, **kwargs):
        client = OpenAI(api_key=self.api_key)
        print(f"Established connection with {self.model_name}")
        response = client.chat.completions.create(
            model=self.model_name,
            messages=prompt,   
            **kwargs
        )
        return response


class GPT35Turbo0125(Model):
    def __init__(self, api_key):
        super().__init__("gpt-3.5-turbo-0125", api_key=api_key)

    def make_call(self, prompt, **kwargs):
        client = OpenAI(api_key=self.api_key)
        print(f"Established connection with {self.model_name}")
        response = client.chat.completions.create(
            model=self.model_name,
            messages=prompt,    
            **kwargs
        )
        return response


class GPT4(Model):
    def __init__(self, api_key):
        super().__init__("gpt-4", api_key=api_key)

    def make_call(self, prompt, **kwargs):
        client = OpenAI(api_key=self.api_key)
        print(f"Established connection with {self.model_name}")
        response = client.chat.completions.create(
            model=self.model_name,
            messages=prompt,  
            **kwargs  
        )
        return response


class GPT35Turbo1106(Model):
    def __init__(self, api_key):
        super().__init__("gpt-3.5-turbo-1106", api_key=api_key)

    def make_call(self, prompt, **kwargs):
        print(f"Established connection with {self.model_name}")
        try:
            client = OpenAI(api_key=self.api_key)
        except Exception as e:
            print(f"Error while using API key: {e}. Trying without API key.")
            client = OpenAI()
        print(f"Calling {self.model_name} with prompt: {prompt}")
        response = client.chat.completions.create(
            model=self.model_name,
            response_format= {"type": "json_object"},
            messages=prompt,
            **kwargs    
        )
        return response


class GPT4Turbo1106(Model):
    def __init__(self, api_key):
        super().__init__("gpt-4-1106-preview", api_key=api_key)

    def make_call(self, prompt, **kwargs):
        print(f"Established connection with {self.model_name}")
        try:
            client = OpenAI(api_key=self.api_key)
        except Exception as e:
            print(f"Error while using API key: {e}. Trying without API key.")
            client = OpenAI()
        print(f"Calling {self.model_name} with prompt: {prompt}")
        response = client.chat.completions.create(
            model=self.model_name,
            messages=prompt,    
            response_format= {"type": "json_object"},
            **kwargs
        )
        return response
    

class Llama7B(Model):
    def __init__(self):
        super().__init__("llama2")

    def make_call(self, prompt, **kwargs):
        print(f"Calling {self.model_name} with prompt: {prompt}")        
        response = ollama.chat(
            model=self.model_name,
            messages=prompt,    
            **kwargs
        )
        return response


class Mistral7B(Model):
    def __init__(self):
        super().__init__("mistral")

    def make_call(self, prompt, **kwargs):
        print(f"Calling {self.model_name} with prompt: {prompt}")        
        response = ollama.chat(
            model=self.model_name,
            messages=prompt,    
            **kwargs
        )
        return response


class Mixtral(Model):
    def __init__(self):
        super().__init__("mixtral")

    def make_call(self, prompt, **kwargs):
        print(f"Calling {self.model_name} with prompt: {prompt}")        
        response = ollama.chat(
            model=self.model_name,
            messages=prompt,    
            **kwargs
        )
        return response
    

class DolphinMistral(Model):
    def __init__(self):
        super().__init__("dolphin-mistral")

    def make_call(self, prompt, **kwargs):
        print(f"Calling {self.model_name} with prompt: {prompt}")        
        response = ollama.chat(
            model=self.model_name,
            messages=prompt,    
            **kwargs
        )
        return response


class Phi(Model):
    def __init__(self):
        super().__init__("phi")

    def make_call(self, prompt, **kwargs):
        print(f"Calling {self.model_name} with prompt: {prompt}")        
        response = ollama.chat(
            model=self.model_name,
            messages=prompt,
            **kwargs
        )
        return response


class ModelFactory:
    model_classes = {
        "gpt-3.5-turbo": GPT35Turbo,
        "gpt-3.5-turbo-0125": GPT35Turbo0125,
        "gpt-4": GPT4,
        "gpt-3.5-turbo-1106": GPT35Turbo1106,
        "gpt-4-1106-preview": GPT4Turbo1106,
        "llama2": Llama7B,
        "mistral": Mistral7B,
        "mixtral": Mixtral,
        "dolphin-mistral": DolphinMistral,
        "phi": Phi
    }

    @staticmethod
    def get_model(model_type, api_key=None):
        if model_type in ModelFactory.model_classes:
            return ModelFactory.model_classes[model_type](api_key=api_key)
        else:
            raise ValueError("Model type not supported")

    @staticmethod
    def list_all_models():
        return list(ModelFactory.model_classes.keys())

