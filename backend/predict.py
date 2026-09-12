import pickle
import sys
import json

# ==========================================
# LOAD TRAINED ML MODEL
# ==========================================

with open("model/scam_model.pkl", "rb") as file:
    model = pickle.load(file)


# ==========================================
# GET MESSAGE FROM NODE.JS
# ==========================================

message = sys.argv[1]

lower_message = message.lower()


# ==========================================
# RULE-BASED SCAM DETECTION
# ==========================================

job_keywords = [
    "job",
    "work from home",
    "salary",
    "registration fee",
    "joining fee",
    "processing fee",
    "job offer",
    "selected for a job",
    "employment",
    "vacancy",
    "pay to confirm",
    "pay a fee",
    "advance payment"
]


otp_keywords = [
    "otp",
    "verification code",
    "one time password"
]


banking_keywords = [
    "bank account",
    "bank",
    "account blocked",
    "account suspended",
    "banking",
    "debit card",
    "credit card"
]


phishing_keywords = [
    "click the link",
    "login immediately",
    "password",
    "verify your account",
    "suspicious link",
    "username"
]


prize_keywords = [
    "winner",
    "prize",
    "lottery",
    "reward",
    "congratulations",
    "claim your reward",
    "free prize"
]


# ==========================================
# COUNT MATCHES
# ==========================================

job_matches = [
    word for word in job_keywords
    if word in lower_message
]

otp_matches = [
    word for word in otp_keywords
    if word in lower_message
]

banking_matches = [
    word for word in banking_keywords
    if word in lower_message
]

phishing_matches = [
    word for word in phishing_keywords
    if word in lower_message
]

prize_matches = [
    word for word in prize_keywords
    if word in lower_message
]


# ==========================================
# PRIORITY-BASED CLASSIFICATION
# ==========================================

# Job Scam
if len(job_matches) >= 2:

    prediction = "job_scam"
    confidence = min(90 + len(job_matches), 99)


# Banking Scam
elif len(banking_matches) >= 2 and (
    "share" in lower_message
    or "verify" in lower_message
    or "blocked" in lower_message
    or "suspended" in lower_message
):

    prediction = "banking_scam"
    confidence = min(90 + len(banking_matches), 99)


# OTP Scam
elif len(otp_matches) >= 1 and (
    "share" in lower_message
    or "send" in lower_message
    or "give" in lower_message
):

    prediction = "otp_scam"
    confidence = min(90 + len(otp_matches), 99)


# Phishing
elif len(phishing_matches) >= 2:

    prediction = "phishing"
    confidence = min(90 + len(phishing_matches), 99)


# Prize Scam
elif len(prize_matches) >= 2:

    prediction = "prize_scam"
    confidence = min(90 + len(prize_matches), 99)


# ==========================================
# FALLBACK TO ML MODEL
# ==========================================

else:

    prediction = model.predict([message])[0]

    probability = model.predict_proba([message])[0]

    confidence = round(max(probability) * 100, 2)


# ==========================================
# RETURN RESULT TO NODE.JS
# ==========================================

result = {
    "prediction": str(prediction),
    "confidence": confidence
}

print(json.dumps(result))