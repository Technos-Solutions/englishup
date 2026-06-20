import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'llama-3.1-70b-versatile'

export async function chatWithAI(messages) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 256,
  })
  return response.choices[0].message.content
}

export async function analyzeConversation(studentMessages, level) {
  const prompt = `You are an expert English teacher. A student at level ${level} just had this conversation. Analyze ONLY the student's messages.

Student messages:
${studentMessages.map((m, i) => `${i + 1}. "${m}"`).join('\n')}

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "fluency_score": <integer 0-100>,
  "errors": [
    { "original": "...", "correction": "...", "explanation": "..." }
  ],
  "vocabulary_suggestions": [
    { "used": "...", "better": "...", "note": "..." }
  ],
  "model_sentence": "...",
  "overall_feedback": "..."
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  })

  try {
    return JSON.parse(response.choices[0].message.content)
  } catch {
    return {
      fluency_score: 70,
      errors: [],
      vocabulary_suggestions: [],
      model_sentence: '',
      overall_feedback: response.choices[0].message.content,
    }
  }
}

export function buildConversationSystem(level, scenario) {
  return `You are a friendly English conversation partner. The student's level is ${level}.
Scenario: ${scenario.description}
Role: ${scenario.aiRole}

Rules:
- Keep responses to 2-3 sentences max
- Match vocabulary complexity to level ${level}
- Ask one follow-up question to keep conversation going
- Be encouraging and natural
- NEVER correct errors mid-conversation — just model correct English naturally`
}
