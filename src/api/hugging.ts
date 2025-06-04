const API_URL = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct'

const API_TOKEN = import.meta.env.VITE_HF_TOKEN

export async function askHuggingFace(prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
    }),
  })

  if (!res.ok) {
    console.error('[HF] Error:', await res.text())
    return 'Ошибка получения ответа 🤖'
  }

  const data = await res.json()
  const text = data?.[0]?.generated_text ?? 'Нет ответа.'
  return text
}
