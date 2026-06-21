import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'llama-3.3-70b-versatile'

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
  "new_words": ["word1", "word2", "word3"],
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

export async function quickCorrection(userMessage, level) {
  const prompt = `English teacher checking a student (level ${level}) message: "${userMessage}"
If there is a grammar or vocabulary error, return ONLY this JSON:
{"has_error": true, "original": "...", "correction": "...", "tip": "..."}
If the message is correct, return ONLY: {"has_error": false}
No markdown, no extra text.`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 150,
  })

  try {
    return JSON.parse(response.choices[0].message.content)
  } catch {
    return { has_error: false }
  }
}

export function buildConversationSystem(level, scenario, recentVocabulary = []) {
  const vocabNote = recentVocabulary.length > 0
    ? `\n- The student has recently used these words: ${recentVocabulary.slice(0, 25).join(', ')}. Naturally introduce NEW vocabulary they haven't seen yet, appropriate for level ${level}.`
    : `\n- Introduce varied, rich vocabulary appropriate for level ${level}.`

  const cityNote = scenario.cityFacts
    ? `\n\nAccurate city reference (use this to give correct information):\n${scenario.cityFacts}`
    : ''

  return `You are a friendly English conversation partner. The student's level is ${level}.
Scenario: ${scenario.description}
Role: ${scenario.aiRole}${cityNote}

Rules:
- Keep responses to 2-3 sentences max
- Match vocabulary complexity to level ${level}
- Ask one follow-up question to keep conversation going
- Be encouraging and natural
- NEVER correct errors mid-conversation — just model correct English naturally
- For travel scenarios: give accurate, helpful tourist information based on the city facts provided${vocabNote}`
}
