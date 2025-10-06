const axios = require('axios');

const LM_BASE = process.env.LM_BASE || 'http://localhost:8307/v1';
const MODEL = process.env.LM_MODEL || 'gpt-oss-20b';
const LM_KEY = process.env.LM_KEY || '';

const SYSTEM_MESSAGE = {
    role: 'system',
    content: 'Yours name is Kitta the super E-Commerce Assistant AI, You are a Product Description generator.'
};

// Controller: handle text input
exports.textToDescription = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Call LM Studio API
        const response = await axios.post(
            `${LM_BASE}/chat/completions`,
            {
                model: MODEL,
                messages: [
                    SYSTEM_MESSAGE,
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 300
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(LM_KEY && { Authorization: `Bearer ${LM_KEY}` })
                }
            }
        );

        const content = response.data?.choices?.[0]?.message?.content || "No response generated.";

        res.json({ content });
    } catch (err) {
        console.error('Error communicating with LM Studio:', err.message);
        res.status(500).json({ error: 'Failed to generate description' });
    }
};
