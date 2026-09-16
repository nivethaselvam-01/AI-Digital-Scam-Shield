const express = require("express");
const cors = require("cors");
const { PythonShell } = require("python-shell");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.send("AI Digital Scam Shield Backend is Running!");
});

app.post("/api/scan", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    const scamWords = [
    "urgent",
    "click",
    "verify",
    "password",
    "otp",
    "winner",
    "prize",
    "free",
    "money",
    "bank",
    "account",
    "claim",

    // Job Scam
    "job",
    "salary",
    "registration fee",
    "joining fee",
    "processing fee",
    "work from home",
    "job offer",
    "pay a fee",
    "advance payment"
];

    const lowerMessage = message.toLowerCase();

    const redFlags = scamWords.filter(word =>
        lowerMessage.includes(word)
    );

    const riskScore = Math.min(redFlags.length * 10, 100);

    let threatLevel;

    if (riskScore >= 50) {
        threatLevel = "High";
    } else if (riskScore >= 20) {
        threatLevel = "Medium";
    } else {
        threatLevel = "Low";
    }

    const options = {
        mode: "text",
        pythonOptions: ["-u"],
        scriptPath: __dirname
    };

    PythonShell.run("predict.py", {
        ...options,
        args: [message]
    }).then(results => {

        const mlResult = JSON.parse(results[0]);

        res.json({
            riskScore,
            threatLevel,
            redFlags,
            prediction: mlResult.prediction,
            confidence: mlResult.confidence,
            message
        });

    }).catch(error => {

        console.error("ML Error:", error);

        res.status(500).json({
            error: "ML model prediction failed"
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});