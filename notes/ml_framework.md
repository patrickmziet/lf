## Description
Here is a framework for building AI models. It has 4 parts: data, model spec, training and eval.
### Data
This part of the framework should:
- Process all the data
- Filter out, adjust data. Can use LLMs and or other statistical methods.
- Idea is to build datasets like you would build a model. You would also want to have "competing" datasets in the same way you would have competing models. We want to be able to do data-centric AI.
- Here is what the metadata for a model would look like:

```json
{
  "name": "dataset_name",
  "log": "description log of how dataset was updated over"
  "size": "x Gb",
  "source": ["sources of data set"],
  "format": "csv, json etc",
  "privacy": "privacy or confidentiality considerations",
  "license": "",
  "citations": ["any", "useful", "docs for making dataset"],
  "known_issues": ["list", "of known issues"],
  "collection_date": "01/01/00"
}
```

### Model spec
- Here is where you specify and build models
- Here is what the metadata for a model would would look like

```json
{
  "model_name": "Example Model",
  "model_version": "1.0",
  "model_architecture": "Convolutional Neural Network",
  "hyperparameters": {
    "learning_rate": 0.001,
    "batch_size": 32,
    "epochs": 50
  },
  "model_training_date": "2023-04-27",
  "model_authors": ["Author 1", "Author 2"],
  "model_description": "This model classifies images into categories.",
  "training_dataset": {
    "name": "Example Training Dataset",
    "version": "1.0",
    "metadata_reference": "path/to/training_dataset_metadata.json"
  },
  "validation_dataset": {
    "name": "Example Validation Dataset",
    "version": "1.0",
    "metadata_reference": "path/to/validation_dataset_metadata.json"
  },
  "test_dataset": {
    "name": "Example Test Dataset",
    "version": "1.0",
    "metadata_reference": "path/to/test_dataset_metadata.json"
  },
  "model_performance_metrics": {
    "accuracy": 0.95,
    "precision": 0.96,
    "recall": 0.94,
    "f1_score": 0.95
  },
  "model_input_output_description": {
    "input": ["image (3 channels, 224x224)"],
    "output": ["probability_distribution (10 categories)"]
  },
  "model_limitations": "The model may not perform well on low-resolution images.",
  "model_dependencies": {
    "libraries": ["tensorflow", "numpy"],
    "frameworks": ["Python 3.8"]
  },
  "model_license": "MIT License",
  "model_citations": [
    {
      "title": "Example Paper",
      "authors": ["Author 1", "Author 2"],
      "year": 2023,
      "journal": "Journal of Machine Learning Research",
      "url": "https://example.com/paper"
    }
  ]
}
```
### Training
- Here is were the models, that have already been specified, are set up to be trained.
- Could involve slurm scripts etc

### Eval
- Here is were trained models are compared and ranked. 
- A ranking should have the dataset, model, training date and the performance metrics
- You should be able to filter/order the by any of the columns. 
- It should print have functionality to print a markdown table.  

| Rank | Dataset              | Model                 | Training Date | Accuracy | Precision | Recall | F1 Score |
|------|----------------------|-----------------------|---------------|----------|-----------|--------|----------|
| 1    | Example Dataset 1    | Model A               | 2023-04-01    | 0.98     | 0.98      | 0.97   | 0.98     |
| 2    | Example Dataset 1    | Model B               | 2023-04-15    | 0.96     | 0.95      | 0.96   | 0.95     |
| 3    | Example Dataset 2    | Model C               | 2023-04-10    | 0.94     | 0.93      | 0.94   | 0.93     |
| 4    | Example Dataset 2    | Model D               | 2023-04-20    | 0.92     | 0.91      | 0.92   | 0.91     |
