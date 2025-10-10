const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load pre-prompt from external txt file
const prePrompt = fs.readFileSync(path.join(__dirname, "prompt.txt"), "utf-8");

const ai = new GoogleGenAI({
    apiKey: "AIzaSyDGRrjcQ2ORugqsIWIFIERV3biZkJ5t6m4", // Use env variable for security
});

// Helper function: Markdown-like → HTML
function formatTextToHTML(text) {
    if (!text) return "";

    // Handle headers
    text = text
        .replace(/###### (.*)/g, "<h6>$1</h6>")
        .replace(/##### (.*)/g, "<h5>$1</h5>")
        .replace(/#### (.*)/g, "<h4>$1</h4>")
        .replace(/### (.*)/g, "<h3>$1</h3>")
        .replace(/## (.*)/g, "<h2>$1</h2>")
        .replace(/# (.*)/g, "<h1>$1</h1>");

    // Handle bold and italics
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    text = text.replace(/(^|\s)\*(.*?)\*(?=\s|$)/g, "$1<i>$2</i>");

    // Handle lists
    const listRegex = /^([\*\u2022]\s+.*(?:\n[\*\u2022]\s+.*)*)/gm;
    text = text.replace(listRegex, (match) => {
        const items = match.split("\n").map(line => line.replace(/^[\*\u2022]\s+/, ""));
        return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
    });

    // Replace remaining newlines with <br>
    text = text.replace(/\n/g, "<br>");

    return text;
}

exports.generateDescription = async (req, res) => {
    try {
        const { prompt, conversation, name, cato, tag } = req.body;

        if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
            return res.status(400).json({ error: "Invalid or missing prompt" });
        }

        // Build conversation for Gemini using only 'user' messages
        const messages = [
            { role: "user", parts: [{ text: prePrompt }] }, // pre-prompt
            ...(conversation || []).map(msg => ({
                role: "user", // ignore assistant role completely
                parts: msg.content
            })),
            { role: "user", parts: [{ text: `${name}-This is the product name, ${prompt}-This is the product description, ${cato}-This is product Category, ${tag}-This is Tag Name` }] } // current prompt
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: messages
        });

        let generatedText = response.text || "No text returned";

        if (!response.candidates || response.candidates.length === 0) {
            const blockReason = response.promptFeedback?.blockReason || "Unknown";
            generatedText = `Content generation blocked: ${blockReason}`;
        }

        const formattedText = formatTextToHTML(generatedText);

        res.json({ text: formattedText });

    } catch (err) {
        console.error("Gemini error:", err.response?.data || err.message);
        res.status(500).json({ error: "AI service failed" });
    }
};
