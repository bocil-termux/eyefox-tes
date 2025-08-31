// scrape.js
import axios from 'axios'

// ==========================
// Hanya Perplexity AI
// ==========================
export const models = {
  'Perplexity AI': 'perplexity-ai'
}

export async function askAI(prompt, modelKey = 'Perplexity AI') {
  const model = models[modelKey]
  if (!model) return `Model "${modelKey}" ga ada.`

  try {
    const { data } = await axios.post(
      'https://whatsthebigdata.com/api/ask-ai/',
      {
        message: prompt,
        model,
        history: []
      },
      {
        headers: {
          'content-type': 'application/json',
          'origin': 'https://whatsthebigdata.com',
          'referer': 'https://whatsthebigdata.com/ai-chat/',
          'user-agent': 'Mozilla/5.0'
        }
      }
    )

    if (data?.text) return `*Model:* Perplexity AI\n\n*Jawaban:*\n${data.text}`
    return '⚠️ Gak ada respon dari AI.'
  } catch (e) {
    return `❌ Error: ${e.response?.status === 400 ? 'Prompt dilarang sama model.' : e.message}`
  }
}
