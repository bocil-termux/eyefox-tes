// =============================
//          server.js
// =============================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import axios from 'axios';
import * as cheerio from 'cheerio';  // ⬅️ Tambahan

// =============================
// Setup __dirname agar bisa pakai ES Modules
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// =============================
// Daftar model AI
// =============================
const models = {
  'Perplexity AI': 'perplexity-ai'
};

// =============================
// Fungsi untuk memanggil Perplexity AI
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
// Scraper: Instagram / TikTok / Facebook
// =============================
const SITE_URL = 'https://instatiktok.com/';

export async function instaTiktokDownloader(platform, inputUrl) {
  if (!inputUrl) throw 'masukin link yg bner!';
  if (!['instagram', 'tiktok', 'facebook'].includes(platform)) throw 'platform ga ada.';

  const form = new URLSearchParams();
  form.append('url', inputUrl);
  form.append('platform', platform);
  form.append('siteurl', SITE_URL);

  try {
    const res = await axios.post(`${SITE_URL}api`, form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': SITE_URL,
        'Referer': SITE_URL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const html = res?.data?.html;
    if (!html || res?.data?.status !== 'success') throw 'gagal.';

    const $ = cheerio.load(html);
    const links = [];

    $('a.btn[href^="http"]').each((_, el) => {
      const link = $(el).attr('href');
      if (link && !links.includes(link)) links.push(link);
    });

    if (links.length === 0) throw 'link ga ada';

    let download;
    if (platform === 'instagram') {
      download = links;
    } else if (platform === 'tiktok') {
      download = links.find(link => /hdplay/.test(link)) || links[0];
    } else if (platform === 'facebook') {
      download = links.at(-1);
    }

    return { status: true, platform, download };
  } catch (e) {
    throw `gagal ambil data: ${e.message || e}`;
  }
}

// =============================
// Routes
// =============================

// Serve halaman AI
app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai2.html'));
});

// Endpoint AI
app.post('/chat', async (req, res) => {
  const { message, model } = req.body;
  if (!message) return res.status(400).json({ reply: 'Pesan kosong' });

  const aiReply = await askAI(message, 'Perplexity AI');
  const formattedReply = aiReply
    .replace(/\*(.*?)\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="https://$1" target="_blank">$1</a>')
    .replace(/@([a-zA-Z0-9_]+)/g, '<a href="https://t.me/$1" target="_blank">@$1</a>');

  res.json({ reply: formattedReply });
});

// Endpoint TikTok
app.get('/tiktok', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing TikTok URL');

  try {
    const apiUrl = `https://xvoidofc.xvoidx.my.id/download/tiktok?apikey=Xvoid&url=${encodeURIComponent(url)}`;
    const apiRes = await fetch(apiUrl);
    const data = await apiRes.json();

    if (!data || !data.video) return res.status(500).send('Failed to fetch video');

    res.json({
      author: data.author || 'unknown',
      desc: data.title || '',
      video_nowm: data.video.nowm || '',
      video_hd: data.video.hd || ''
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpoint Instagram / Facebook / TikTok (scraping instatiktok)
app.post('/scrape', async (req, res) => {
  try {
    const { platform, url } = req.body;
    const result = await instaTiktokDownloader(platform, url);
    res.json(result);
  } catch (err) {
    res.json({ status: false, error: err.toString() });
  }
});

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
