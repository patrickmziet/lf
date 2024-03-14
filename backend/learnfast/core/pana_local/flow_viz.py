import pandas as pd
from .pflow import PromptFlow
from .lparse import parse_flashcards, parse_json_string

class FlowViz:
    def __init__(self, models, flows):
        self.models = models
        self.flows = flows
        data = {}
        format_dict = lambda d: [f"{k}: {v}" for k, v in d.items()]
        for m in self.models:
            for f in self.flows:
                if not (f == "json_flow" and "1106" not in m) or (f != "json_flow" and "1106" in m):
                    continue
                new_flow = PromptFlow.load_from_file(f"{f}_{m}")
                mr = new_flow.most_recent()
                if "1106" in m:
                    flashcards = parse_json_string(mr["content"])
                else:
                    flashcards = parse_flashcards(mr["content"])
                temp_list = [format_dict(card) for card in flashcards.values()]
                data[(m, f)] = [item for sublist in temp_list for item in sublist]
        
        df = pd.DataFrame(data)
        pd.set_option('display.max_colwidth', None)
        pd.set_option('display.expand_frame_repr', True)
        self.table = df

    def by_model(self, model):
        return self.table.loc[:, (model, slice(None))]

    def by_flow(self, flow):
        return self.table.loc[:, (slice(None), flow)]
    



