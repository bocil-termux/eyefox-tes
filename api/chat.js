// api/chat.js
// Serverless function untuk Vercel

import axios from 'axios';

// =============================
// Daftar model AI (dipindahkan dari server.js)
// =============================
const models = {
  'Perplexity AI': 'perplexity-ai'
};

// =============================
// Fungsi untuk memanggil Perplexity AI (dipindahkan dari server.js)
// =============================
async function askAI(prompt, modelKey) {
  const model = models[modelKey];
  if (!model) return `Model "${modelKey}" ga ada.`;

  try {
    const { data } = await axios.post('https://whatsthebigdata.com/api/ask-ai/', {
      message: prompt,
      model,
      history: []
    }, {
      headers: {
        'content-type': 'application/json',
        'origin': 'https://whatsthebigdata.com',
        'referer': 'https://whatsthebigdata.com/ai-chat/',
        'user-agent': 'Mozilla/5.0'
      }
    });

    if (data?.text) return `*Model:* ${modelKey}\n\n*Jawaban:*\n${data.text}`;
    return '⚠️ Gak ada respon dari AI.';
  } catch (e) {
    return `❌ Error: ${e.response?.status === 400 ? 'Prompt dilarang sama model.' : e.message}`;
  }
}

// =============================
// Handler Vercel Serverless Function
// =============================
export default async function handler(req, res) {
  // Hanya menerima method POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ reply: `Method ${req.method} Not Allowed` });
  }

  const { message, model } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'Pesan kosong' });
  }

  try {
    const aiReply = await askAI(message, 'Perplexity AI');
    const formattedReply = aiReply
      .replace(/\*(.*?)\*/g, '<b>$1</b>')
      .replace(/_(.*?)_/g, '<i>$1</i>')
      .replace(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="https://$1" target="_blank">$1</a>')
      .replace(/@([a-zA-Z0-9_]+)/g, '<a href="https://t.me/$1" target="_blank">@$1</a>');

    // Kembalikan JSON
    res.status(200).json({ reply: formattedReply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    // Kembalikan error dalam format JSON juga
    res.status(500).json({ reply: `❌ Internal Server Error: ${error.message}` });
  }
}