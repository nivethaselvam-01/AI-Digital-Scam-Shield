import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import pickle

# Load dataset
data = pd.read_csv("model/scam_dataset.csv")

# Input and output
X = data["message"]
y = data["label"]

# Create ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])

# Train model
model.fit(X, y)

# Save trained model
with open("model/scam_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("✅ Scam detection model trained successfully!")
print("✅ Model saved as model/scam_model.pkl")