# File to contain the prompt flow functionality
import json
import os

class PromptFlow:
    def __init__(self, name, description, flow=None):
        self.name = name
        self.flow = flow if flow is not None else []
        self.description = description


    def add_system_message(self, content):
        if self.flow and self.flow[0]["role"] == "system":
            raise ValueError("A system message already exists and must be the first message in the flow.")
        else:
            self.flow.insert(0, {"role": "system", "content": content})
    
    def add_interaction(self, role, content):
        if role not in ["user", "assistant"]:
            raise ValueError("Invalid role. Role must be 'user', or 'assistant'.")

        if self.flow:
            last_role = self.flow[-1]["role"]
            if last_role == role and role != "system":
                raise ValueError("Cannot have two consecutive interactions with the same role (user/assistant).")
        
        self.flow.append({"role": role, "content": content})

    def update_interaction(self, index, role, content):
        if role not in ["system", "user", "assistant"]:
            raise ValueError("Invalid role. Role must be 'system', 'user', or 'assistant'.")
        if index < len(self.flow):
            self.flow[index] = {"role": role, "content": content}
        else:
            raise IndexError("Interaction index out of range")

    def save_to_file(self):
        dir_name = "pflows"
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
        filename = f"{dir_name}/{self.name}.json"
        with open(filename, 'w') as file:
            json.dump({"description": self.description, "messages": self.flow}, file, indent=4)

    def check_exists(self):
        filename = f"pflows/{self.name}.json"
        return os.path.exists(filename)
    
    def most_recent(self):
        return self.flow[-1]

    @classmethod
    def load_from_file(cls, name):
        filename = f"pflows/{name}.json"
        if not os.path.exists(filename):
            raise FileNotFoundError(f"No saved prompt flow found with the name '{name}'")
        with open(filename, 'r') as file:
            jsn = json.load(file)
        return cls(name, jsn["description"], jsn["messages"])

    def __repr__(self):
        return json.dumps(self.flow, indent=4)


