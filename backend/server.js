const express = require("express");
const cors = require("cors");
const { PythonShell } = require("python-shell");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

const usersFile = path.join(
    __dirname,
    "../database/users.json"
);


// Middleware
app.use(cors());
app.use(express.json());


// Serve frontend
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// Make sure users.json exists
if (!fs.existsSync(usersFile)) {

    fs.writeFileSync(
        usersFile,
        "[]"
    );

}


// ===============================
// REGISTER API
// ===============================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                error: "Name, email and password are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });

        }


        const users = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );


        const existingUser = users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


        if (existingUser) {

            return res.status(409).json({
                error: "User already exists"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        const newUser = {

            name: name,

            email: email.toLowerCase(),

            password: hashedPassword

        };


        users.push(newUser);


        fs.writeFileSync(
            usersFile,
            JSON.stringify(users, null, 2)
        );


        res.status(201).json({

            message: "Registration successful"

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        res.status(500).json({

            error: "Registration failed"

        });

    }

});


// ===============================
// LOGIN API
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                error:
                    "Email and password are required"

            });

        }


        const users = JSON.parse(
            fs.readFileSync(usersFile, "utf8")
        );


        const user = users.find(

            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()

        );


        if (!user) {

            return res.status(401).json({

                error:
                    "Invalid email or password"

            });

        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                error:
                    "Invalid email or password"

            });

        }


        // Create JWT token
        const token = jwt.sign(

            {
                email: user.email,
                name: user.name
            },

            process.env.JWT_SECRET ||
            "development-secret",

            {
                expiresIn: "1h"
            }

        );


        res.json({

            message:
                "Login successful",

            token: token,

            user: {

                name: user.name,

                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            error: "Login failed"

        });

    }

});


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(
            __dirname,
            "../frontend/index.html"
        )

    );

});


// ===============================
// SCAM SCAN API
// ===============================

app.post("/api/scan", (req, res) => {

    const { message } = req.body;


    if (!message) {

        return res.status(400).json({

            error:
                "Message is required"

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


    const lowerMessage =
        message.toLowerCase();


    const redFlags =
        scamWords.filter(word =>
            lowerMessage.includes(word)
        );


    const riskScore =
        Math.min(
            redFlags.length * 10,
            100
        );


    let threatLevel;


    if (riskScore >= 50) {

        threatLevel = "High";

    }

    else if (riskScore >= 20) {

        threatLevel = "Medium";

    }

    else {

        threatLevel = "Low";

    }


    const options = {

        mode: "text",

        pythonOptions: ["-u"],

        scriptPath: __dirname

    };


    PythonShell.run(
        "predict.py",

        {
            ...options,

            args: [message]

        }

    )

        .then(results => {

            const mlResult =
                JSON.parse(results[0]);


            res.json({

                riskScore,

                threatLevel,

                redFlags,

                prediction:
                    mlResult.prediction,

                confidence:
                    mlResult.confidence,

                message

            });

        })

        .catch(error => {

            console.error(
                "ML Error:",
                error
            );


            res.status(500).json({

                error:
                    "ML model prediction failed"

            });

        });

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
