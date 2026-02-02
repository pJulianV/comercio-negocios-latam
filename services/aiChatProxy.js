// services/aiChatProxy.js
// Proxy seguro para Hugging Face Inference API

import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

const HF_TOKEN = process.env.HF_TOKEN; // Debe estar en variables de entorno
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt requerido' });
  try {
    const hfRes = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {})
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: 'system', content: `Eres el asistente virtual oficial de Comercio y Negocios Latam SAC. Solo responde preguntas sobre la empresa, sus servicios, valores y datos de contacto. Si no tienes información específica, responde: "No tengo ese dato, pero puedo ayudarte con información sobre nuestros servicios, valores o contacto." Sé siempre breve, concreto y veraz. Nunca inventes información. 

Información de contacto oficial:
Dirección: San Isidro, Lima, Perú
Email: info@cynlatam.com
Teléfono: +51 969 406 930
Horario de Atención: Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 1:00 PM
` },
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
