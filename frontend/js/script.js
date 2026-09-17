// Guest scan limit
let guestScanCount = Number(localStorage.getItem("guestScanCount")) || 0;
const guestScanLimit = 2;
const token = localStorage.getItem("token");
const scanButton = document.querySelector(".scan-content button");
const scanInput = document.querySelector(".scan-content textarea");
const resultSection = document.querySelector(".result-section");

const resultTitle = document.querySelector(".result-card h3");
const riskLevel = document.querySelector(".risk-level");

const riskScore =
    document.querySelector(".risk-details div:nth-child(1) strong");

const redFlags =
    document.querySelector(".risk-details div:nth-child(2) strong");

const threatLevel =
    document.querySelector(".risk-details div:nth-child(3) strong");

const confidence =
    document.querySelector(".risk-details div:nth-child(4) strong");

const scamType =
    document.querySelector(".scam-type strong");

const recommendation =
    document.querySelector(".recommendation strong");

const redFlagsList =
    document.querySelector("#redFlagsList");

const historyList =
    document.querySelector("#historyList");


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

const totalScans =
    document.querySelector("#totalScans");

const safeScans =
    document.querySelector("#safeScans");

const mediumScans =
    document.querySelector("#mediumScans");

const highScans =
    document.querySelector("#highScans");


// ==========================================
// RISK VISUALIZATION
// ==========================================

const safePercentage =
    document.querySelector("#safePercentage");

const mediumPercentage =
    document.querySelector("#mediumPercentage");

const highPercentage =
    document.querySelector("#highPercentage");

const safeBar =
    document.querySelector("#safeBar");

const mediumBar =
    document.querySelector("#mediumBar");

const highBar =
    document.querySelector("#highBar");


// ==========================================
// DYNAMIC RESULT ELEMENTS
// ==========================================

const warningMessage =
    document.querySelector("#warningMessage");

const riskDescription =
    document.querySelector("#riskDescription");

const safetyActions =
    document.querySelector(".safety-actions");


// ==========================================
// WHY IS THIS SUSPICIOUS
// ==========================================

const whySuspiciousList =
    document.querySelector("#whySuspiciousList");


// ==========================================
// SCAN BUTTON
// ==========================================

scanButton.addEventListener("click", async function () {
        // Guest scan limit
    if (!token && guestScanCount >= guestScanLimit) {
        alert("You have used your 2 free scans. Please login to continue.");
        window.location.href = "login.html";
        return;
    }

    const originalText =
        scanInput.value.trim();

    if (originalText === "") {

        alert(
            "Please enter a message or link to analyze."
        );

        return;
    }


    // ==========================================
    // SHOW RESULT SECTION IMMEDIATELY
    // ==========================================

    resultSection.style.display = "block";


    // Immediately scroll to result section
    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    // ==========================================
    // LOADING STATE
    // ==========================================

    scanButton.disabled = true;

    scanButton.textContent =
        "Analyzing...";


    resultTitle.textContent =
        "Analyzing Content...";


    riskLevel.textContent =
        "Please wait...";


    riskLevel.className =
        "risk-level";


    riskScore.textContent =
        "--%";


    redFlags.textContent =
        "--";


    threatLevel.textContent =
        "Analyzing";


    confidence.textContent =
        "--%";


    scamType.textContent =
        "Analyzing...";


    recommendation.textContent =
        "AI is analyzing the submitted content.";


    if (warningMessage) {

        warningMessage.textContent =
            "🔍 Please wait while the AI scam detection system analyzes this content.";

    }


    if (riskDescription) {

        riskDescription.textContent =
            "The system is checking suspicious keywords and AI-based scam patterns.";

    }


    if (redFlagsList) {

        redFlagsList.innerHTML = `

            <li>
                🔍 Analyzing suspicious patterns...
            </li>

        `;

    }


    if (whySuspiciousList) {

        whySuspiciousList.innerHTML = `

            <li>
                🔍 AI analysis is in progress...
            </li>

        `;

    }


    if (safetyActions) {

        safetyActions.innerHTML = `

            <h4>🛡️ What You Should Do</h4>

            <ul id="safetyList">

                <li>
                    ⏳ Please wait for the analysis result.
                </li>

            </ul>

        `;

    }


    try {

        const response = await fetch(
            "/api/scan",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: originalText
                })
            }
        );


       
    const data =
    await response.json();

    
if (!response.ok) {

    throw new Error(
        data.error || "Scan failed"
    );

}

// Count successful guest scan
if (!token) {

    guestScanCount = guestScanCount + 1;

    localStorage.setItem(
        "guestScanCount",
        guestScanCount.toString()
    );

}   

        // ==========================================
        // RISK DATA
        // ==========================================

        const score =
            data.riskScore;

        const flags =
            data.redFlags.length;


        // ==========================================
        // DISPLAY RED FLAGS
        // ==========================================

        redFlagsList.innerHTML = "";


        if (data.redFlags.length === 0) {

            const li =
                document.createElement("li");

            li.textContent =
                "No suspicious patterns detected.";

            redFlagsList.appendChild(li);

        }

        else {

            data.redFlags.forEach(function (word) {

                const li =
                    document.createElement("li");

                li.textContent =
                    word + " detected";

                redFlagsList.appendChild(li);

            });

        }


        // ==========================================
        // ML SCAM TYPE
        // ==========================================

        const prediction =
            String(data.prediction)
                .toLowerCase()
                .trim();


        if (prediction === "prize_scam") {

            scamType.textContent =
                "Prize / Lottery Scam";

            recommendation.textContent =
                "Do not pay money or share personal information.";

        }

        else if (prediction === "banking_scam") {

            scamType.textContent =
                "Banking Scam";

            recommendation.textContent =
                "Contact your bank using the official number.";

        }

        else if (prediction === "otp_scam") {

            scamType.textContent =
                "OTP Scam";

            recommendation.textContent =
                "Never share OTP or verification codes.";

        }

        else if (prediction === "phishing") {

            scamType.textContent =
                "Phishing Scam";

            recommendation.textContent =
                "Do not click suspicious links. Verify the sender.";

        }

        else if (prediction === "job_scam") {

            scamType.textContent =
                "Job Scam";

            recommendation.textContent =
                "Do not pay registration fees or share personal information for a job offer.";

        }

        else if (prediction === "safe") {

            scamType.textContent =
                "Safe / No Scam Detected";

            recommendation.textContent =
                "No major scam pattern detected. Stay cautious.";

        }

        else {

            scamType.textContent =
                data.prediction;

            recommendation.textContent =
                "Stay cautious and verify the sender through official channels.";

        }


        // ==========================================
        // HIGH RISK
        // ==========================================

        if (score >= 40) {

            resultTitle.textContent =
                "Potential Scam Detected";


            riskLevel.textContent =
                "Risk Level: HIGH";


            threatLevel.textContent =
                "High";


            riskLevel.className =
                "risk-level high";


            // HIGH DESCRIPTION

            if (riskDescription) {

                riskDescription.textContent =
                    "This content contains multiple suspicious patterns that may indicate a scam attempt.";

            }


            // HIGH WARNING

            if (warningMessage) {

                warningMessage.textContent =
                    "⚠️ Do not click links or share OTP, passwords, bank details, or personal information.";

            }


            // HIGH SAFETY ACTIONS

            if (safetyActions) {

                let safetyContent = "";


                if (prediction === "phishing") {

                    safetyContent = `

                        <li>
                            🚫 Do not click suspicious links.
                        </li>

                        <li>
                            🔐 Never enter your password or OTP on unknown websites.
                        </li>

                        <li>
                            🌐 Open the official website or app directly instead of using the link.
                        </li>

                        <li>
                            📢 Report the phishing message and block the sender.
                        </li>

                    `;

                }


                else if (prediction === "otp_scam") {

                    safetyContent = `

                        <li>
                            🔐 Never share OTP or verification codes with anyone.
                        </li>

                        <li>
                            📱 Do not share codes received on your mobile.
                        </li>

                        <li>
                            🚫 Do not follow instructions from unknown callers or messages.
                        </li>

                        <li>
                            📢 Report the suspicious message and block the sender.
                        </li>

                    `;

                }


                else if (prediction === "banking_scam") {

                    safetyContent = `

                        <li>
                            🔐 Never share OTP, passwords or banking details.
                        </li>

                        <li>
                            🏦 Contact your bank through the official number.
                        </li>

                        <li>
                            🚫 Do not click links received through suspicious messages.
                        </li>

                        <li>
                            📢 Report the suspicious message and block the sender.
                        </li>

                    `;

                }


                else if (prediction === "prize_scam") {

                    safetyContent = `

                        <li>
                            🎁 Do not pay any processing fee or advance payment.
                        </li>

                        <li>
                            🔐 Do not share personal, banking or OTP details.
                        </li>

                        <li>
                            🚫 Do not click prize or reward claim links.
                        </li>

                        <li>
                            📢 Report the message and block the sender.
                        </li>

                    `;

                }


                else if (prediction === "job_scam") {

                    safetyContent = `

                        <li>
                            💼 Do not pay registration or processing fees for a job.
                        </li>

                        <li>
                            💰 Be cautious of unrealistic salary or work-from-home offers.
                        </li>

                        <li>
                            🔐 Do not share personal, banking or OTP details.
                        </li>

                        <li>
                            📢 Verify the company through its official website and report suspicious offers.
                        </li>

                    `;

                }


                else {

                    safetyContent = `

                        <li>
                            🚫 Do not click any suspicious links.
                        </li>

                        <li>
                            🔐 Never share OTP, passwords or banking details.
                        </li>

                        <li>
                            🔍 Verify the sender through official channels.
                        </li>

                        <li>
                            📢 Report the suspicious message and block the sender.
                        </li>

                    `;

                }


                safetyActions.innerHTML = `

                    <h4>🛡️ What You Should Do</h4>

                    <ul id="safetyList">

                        ${safetyContent}

                    </ul>

                `;

            }

        }


        // ==========================================
        // MEDIUM RISK
        // ==========================================

        else if (score >= 20) {

            resultTitle.textContent =
                "Suspicious Content";


            riskLevel.textContent =
                "Risk Level: MEDIUM";


            threatLevel.textContent =
                "Medium";


            riskLevel.className =
                "risk-level medium";


            // MEDIUM DESCRIPTION

            if (riskDescription) {

                riskDescription.textContent =
                    "This content contains some suspicious patterns that require caution.";

            }


            // MEDIUM WARNING

            if (warningMessage) {

                warningMessage.textContent =
                    "⚠️ Be cautious and verify the sender before taking any action.";

            }


            // MEDIUM SAFETY ACTIONS

            if (safetyActions) {

                let safetyContent = "";


                if (prediction === "otp_scam") {

                    safetyContent = `

                        <li>
                            🔐 Never share OTP or verification codes with anyone.
                        </li>

                        <li>
                            📱 Do not share codes received on your mobile.
                        </li>

                        <li>
                            🔍 Verify the request through official channels.
                        </li>

                        <li>
                            📢 Report and block suspicious messages or callers.
                        </li>

                    `;

                }


                else if (prediction === "banking_scam") {

                    safetyContent = `

                        <li>
                            🏦 Contact your bank using the official customer-care number.
                        </li>

                        <li>
                            🔐 Never share OTP, password or banking details.
                        </li>

                        <li>
                            🚫 Avoid clicking links in unexpected bank messages.
                        </li>

                        <li>
                            🔍 Verify the message before taking any action.
                        </li>

                    `;

                }


                else if (prediction === "phishing") {

                    safetyContent = `

                        <li>
                            🚫 Avoid clicking unknown links.
                        </li>

                        <li>
                            🔐 Never enter passwords or OTP on unfamiliar websites.
                        </li>

                        <li>
                            🌐 Visit the official website directly.
                        </li>

                        <li>
                            🔍 Verify the sender before responding.
                        </li>

                    `;

                }


                else if (prediction === "job_scam") {

                    safetyContent = `

                        <li>
                            💼 Do not pay registration or processing fees before getting a verified job.
                        </li>

                        <li>
                            💰 Be cautious of unusually high salary promises.
                        </li>

                        <li>
                            🔍 Verify the company and job offer through official sources.
                        </li>

                        <li>
                            🔐 Do not share personal or banking information.
                        </li>

                    `;

                }


                else if (prediction === "prize_scam") {

                    safetyContent = `

                        <li>
                            🎁 Verify the prize or lottery claim before responding.
                        </li>

                        <li>
                            💰 Never pay advance or processing fees.
                        </li>

                        <li>
                            🔐 Do not share personal or banking information.
                        </li>

                        <li>
                            🚫 Avoid clicking unknown prize links.
                        </li>

                    `;

                }


                else {

                    safetyContent = `

                        <li>
                            🔍 Verify the sender before responding.
                        </li>

                        <li>
                            🔗 Avoid clicking unknown or suspicious links.
                        </li>

                        <li>
                            📞 Verify the request using official channels.
                        </li>

                        <li>
                            ⚠️ Do not share sensitive information until you confirm the message is genuine.
                        </li>

                    `;

                }


                safetyActions.innerHTML = `

                    <h4>🛡️ What You Should Do</h4>

                    <ul id="safetyList">

                        ${safetyContent}

                    </ul>

                `;

            }

        }


        // ==========================================
        // LOW RISK
        // ==========================================

        else {

            resultTitle.textContent =
                "No Major Threat Detected";


            riskLevel.textContent =
                "Risk Level: LOW";


            threatLevel.textContent =
                "Low";


            riskLevel.className =
                "risk-level low";


            // LOW DESCRIPTION

            if (riskDescription) {

                riskDescription.textContent =
                    "This content does not show major suspicious patterns.";

            }


            // LOW WARNING

            if (warningMessage) {

                warningMessage.textContent =
                    "✅ No major scam patterns detected. Continue to stay cautious online.";

            }


            // LOW SAFETY ACTIONS

            if (safetyActions) {

                safetyActions.innerHTML = `

                    <h4>🛡️ What You Should Do</h4>

                    <ul id="safetyList">

                        <li>
                            🛡️ Continue using strong and unique passwords.
                        </li>

                        <li>
                            🔐 Never share OTPs or passwords with anyone.
                        </li>

                        <li>
                            🔍 Always verify unexpected messages before taking action.
                        </li>

                        <li>
                            📱 Keep your devices and apps updated for better security.
                        </li>

                    </ul>

                `;

            }

        }


        // ==========================================
        // DISPLAY SCORE
        // ==========================================

        riskScore.textContent =
            score + "%";


        redFlags.textContent =
            flags;


        // ==========================================
        // AI CONFIDENCE
        // ==========================================

        if (data.confidence !== undefined) {

            confidence.textContent =
                data.confidence + "%";

        }

        else {

            confidence.textContent =
                "--%";

        }


        // ==========================================
        // WHY IS THIS SUSPICIOUS
        // ==========================================

        updateWhySuspicious(
            prediction,
            data.redFlags,
            score
        );


        // ==========================================
        // SAVE SCAN HISTORY
        // ==========================================

        const historyData = {

            message: originalText,

            score: score,

            date: new Date().toLocaleString()

        };


        let scanHistory =
            JSON.parse(
                localStorage.getItem("scanHistory")
            ) || [];


        // Remove duplicate message

        scanHistory =
            scanHistory.filter(
                item => item.message !== originalText
            );


        // Add latest scan at top

        scanHistory.unshift(
            historyData
        );


        // Keep latest 10 scans

        scanHistory =
            scanHistory.slice(0, 10);


        localStorage.setItem(
            "scanHistory",
            JSON.stringify(scanHistory)
        );


        // ==========================================
        // UPDATE DASHBOARD
        // ==========================================

        updateDashboardStats();


        // ==========================================
        // UPDATE HISTORY
        // ==========================================

        displayHistory();

    }


    catch (error) {

        console.error(
            "Backend Error:",
            error
        );


        resultTitle.textContent =
            "Scan Failed";


        riskLevel.textContent =
            "Unable to Analyze";


        if (warningMessage) {

            warningMessage.textContent =
                "❌ Unable to connect to the scam detection server.";

        }


        alert(
            "Unable to connect to the scam detection server. Please make sure the backend is running."
        );

    }


    finally {

        // ==========================================
        // RESTORE BUTTON
        // ==========================================

        scanButton.disabled = false;

        scanButton.textContent =
            "Analyze Now";

    }

});


// ==========================================
// WHY IS THIS SUSPICIOUS FUNCTION
// ==========================================

function updateWhySuspicious(
    prediction,
    redFlagsData,
    score
) {

    if (!whySuspiciousList) {
        return;
    }


    // Clear old reasons

    whySuspiciousList.innerHTML = "";


    let reasons = [];


    // ==========================================
    // RED FLAG BASED REASONS
    // ==========================================

    if (
        redFlagsData &&
        redFlagsData.length > 0
    ) {

        redFlagsData.forEach(
            function (word) {

                reasons.push(
                    "🚩 Suspicious keyword detected: " +
                    word
                );

            }
        );

    }


    // ==========================================
    // SCAM TYPE REASONS
    // ==========================================

    if (prediction === "phishing") {

        reasons.push(
            "🔗 The message may contain suspicious link or verification-related content."
        );

        reasons.push(
            "🔐 It may attempt to collect passwords or personal information."
        );

    }


    else if (prediction === "otp_scam") {

        reasons.push(
            "🔐 The message is related to OTP or verification codes."
        );

        reasons.push(
            "⚠️ Legitimate organizations generally do not ask you to share your OTP."
        );

    }


    else if (prediction === "banking_scam") {

        reasons.push(
            "🏦 The message contains banking or account-related content."
        );

        reasons.push(
            "🔐 It may attempt to obtain sensitive banking information."
        );

    }


    else if (prediction === "prize_scam") {

        reasons.push(
            "🎁 The message contains prize, reward or winning-related content."
        );

        reasons.push(
            "💰 Prize scams often attempt to make users pay money or share personal information."
        );

    }


    else if (prediction === "job_scam") {

        reasons.push(
            "💼 The message contains job or employment-related content."
        );

        reasons.push(
            "💰 It may involve unrealistic offers or requests for registration/payment."
        );

    }


    // ==========================================
    // RISK LEVEL REASON
    // ==========================================

    if (score >= 40) {

        reasons.push(
            "🚨 Multiple suspicious patterns indicate a high-risk message."
        );

    }

    else if (score >= 20) {

        reasons.push(
            "⚠️ Some suspicious patterns require further verification."
        );

    }


    // ==========================================
    // SAFE MESSAGE
    // ==========================================

    if (
        score < 20 &&
        reasons.length === 0
    ) {

        reasons.push(
            "✅ No major suspicious patterns were detected in this content."
        );

        reasons.push(
            "🛡️ Always verify unexpected messages before taking action."
        );

    }


    // ==========================================
    // DISPLAY REASONS
    // ==========================================

    reasons.forEach(
        function (reason) {

            const li =
                document.createElement("li");

            li.textContent =
                reason;

            whySuspiciousList.appendChild(li);

        }
    );

}


// ==========================================
// UPDATE DASHBOARD STATISTICS
// ==========================================

function updateDashboardStats() {

    let scanHistory =
        JSON.parse(
            localStorage.getItem("scanHistory")
        ) || [];


    let total =
        scanHistory.length;

    let safe = 0;

    let medium = 0;

    let high = 0;


    scanHistory.forEach(
        function (item) {

            if (item.score >= 40) {

                high++;

            }

            else if (item.score >= 20) {

                medium++;

            }

            else {

                safe++;

            }

        }
    );


    // Dashboard counts

    if (totalScans) {

        totalScans.textContent =
            total;

    }


    if (safeScans) {

        safeScans.textContent =
            safe;

    }


    if (mediumScans) {

        mediumScans.textContent =
            medium;

    }


    if (highScans) {

        highScans.textContent =
            high;

    }


    // ==========================================
    // CALCULATE PERCENTAGES
    // ==========================================

    let safePercent = 0;

    let mediumPercent = 0;

    let highPercent = 0;


    if (total > 0) {

        safePercent =
            Math.round(
                (safe / total) * 100
            );

        mediumPercent =
            Math.round(
                (medium / total) * 100
            );

        highPercent =
            Math.round(
                (high / total) * 100
            );

    }


    // ==========================================
    // SHOW PERCENTAGES
    // ==========================================

    if (safePercentage) {

        safePercentage.textContent =
            safePercent + "%";

    }


    if (mediumPercentage) {

        mediumPercentage.textContent =
            mediumPercent + "%";

    }


    if (highPercentage) {

        highPercentage.textContent =
            highPercent + "%";

    }


    // ==========================================
    // UPDATE PROGRESS BARS
    // ==========================================

    if (safeBar) {

        safeBar.style.width =
            safePercent + "%";

    }


    if (mediumBar) {

        mediumBar.style.width =
            mediumPercent + "%";

    }


    if (highBar) {

        highBar.style.width =
            highPercent + "%";

    }

}


// ==========================================
// DISPLAY SCAN HISTORY
// ==========================================

function displayHistory() {

    historyList.innerHTML = "";


    let scanHistory =
        JSON.parse(
            localStorage.getItem("scanHistory")
        ) || [];


    if (scanHistory.length === 0) {

        historyList.innerHTML = `

            <div class="empty-history">

                <span>🔍</span>

                <p>
                    No scans yet.
                    Analyze a message to see your history.
                </p>

            </div>

        `;

        return;

    }


    scanHistory.forEach(
        function (item) {

            const historyItem =
                document.createElement("div");


            historyItem.className =
                "history-card";


            const riskClass =
                item.score >= 40
                    ? "high"
                    : item.score >= 20
                        ? "medium"
                        : "low";


            historyItem.innerHTML = `

                <div class="history-info">

                    <div class="history-message">
                        ${item.message}
                    </div>

                    <div class="history-date">
                        ${item.date}
                    </div>

                </div>

                <div class="history-right">

                    <div class="history-risk ${riskClass}">
                        ${item.score}% Risk
                    </div>

                    <button class="delete-history-btn">
                        🗑️
                    </button>

                </div>

            `;


            historyList.appendChild(
                historyItem
            );

        }
    );

}


// ==========================================
// CLEAR ALL HISTORY
// ==========================================

const clearHistoryBtn =
    document.querySelector("#clearHistoryBtn");

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener("click", function () {

        const scanHistory =
            JSON.parse(
                localStorage.getItem("scanHistory")
            ) || [];


        if (scanHistory.length === 0) {

            alert("No scan history to clear.");

            return;
        }


        const confirmClear =
            confirm(
                "Are you sure you want to clear all scan history?"
            );


        if (!confirmClear) {
            return;
        }


        localStorage.removeItem("scanHistory");


        displayHistory();


        updateDashboardStats();


        alert(
            "Scan history cleared successfully."
        );

    });

}


// ==========================================
// DELETE INDIVIDUAL HISTORY
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "delete-history-btn"
            )
        ) {

            return;

        }


        const historyCard =
            event.target.closest(".history-card");


        if (!historyCard) {
            return;
        }


        const messageElement =
            historyCard.querySelector(
                ".history-message"
            );


        const message =
            messageElement.textContent.trim();


        const confirmDelete =
            confirm(
                "Delete this scan from history?"
            );


        if (!confirmDelete) {
            return;
        }


        let scanHistory =
            JSON.parse(
                localStorage.getItem("scanHistory")
            ) || [];


        scanHistory =
            scanHistory.filter(
                item => item.message !== message
            );


        localStorage.setItem(
            "scanHistory",
            JSON.stringify(scanHistory)
        );


        // Refresh history

        displayHistory();


        // Refresh dashboard

        updateDashboardStats();

    }
);


// ==========================================
// LOAD DATA ON PAGE LOAD
// ==========================================

displayHistory();

updateDashboardStats();


// ==========================================
// PROFESSIONAL NAVBAR
// ==========================================

const navLinks =
    document.querySelectorAll(
        ".navbar a[href^='#']"
    );


navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                const targetSection =
                    document.querySelector(
                        targetId
                    );


                if (targetSection) {

                    event.preventDefault();


                    targetSection.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            }
        );

    }
);


// ==========================================
// ACTIVE NAVIGATION ON SCROLL
// ==========================================

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener(
    "scroll",
    function () {

        let currentSection = "";


        sections.forEach(
            function (section) {

                const sectionTop =
                    section.offsetTop - 120;


                const sectionHeight =
                    section.offsetHeight;


                if (
                    window.scrollY >= sectionTop &&
                    window.scrollY <
                    sectionTop + sectionHeight
                ) {

                    currentSection =
                        section.getAttribute("id");

                }

            }
        );


        navLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );


                const linkTarget =
                    link.getAttribute("href");


                if (
                    linkTarget ===
                    "#" + currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        window.location.href = "index.html";
    });
}