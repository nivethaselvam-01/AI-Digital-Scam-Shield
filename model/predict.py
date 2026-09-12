import pickle

# Load trained model
with open("model/scam_model.pkl", "rb") as file:
    model = pickle.load(file)

# Get message from user
message = input("Enter a message to scan: ")

# Predict
prediction = model.predict([message])[0]

# Get confidence
probability = model.predict_proba([message])[0]
confidence = max(probability) * 100

print("\n===== SCAM DETECTION RESULT =====")
print("Message:", message)
print("Prediction:", prediction)
print("Confidence:", round(confidence, 2), "%")