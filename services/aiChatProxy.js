// services/aiChatProxy.js
// Proxy seguro para Hugging Face Inference API
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const HF_TOKEN = process.env.HF_TOKEN; // Debe estar en variables de entorno
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'openai/gpt-oss-120b:fastest';

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt requerido' });
  try {
    const hfRes = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await hfRes.json();
    let result = 'Error en la respuesta AI';
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      result = data.choices[0].message.content;
    }
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con Hugging Face' });
  }
});

export default router;
