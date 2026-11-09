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
  const prompt = `You are an expert English teacher. A student at level ${level} just had a spoken conversation (transcribed by voice recognition). Analyze ONLY the student's messages.

IMPORTANT: These messages come from speech-to-text, so they have NO punctuation (no commas, periods, apostrophes). Do NOT flag missing punctuation or capitalization as errors — only flag real grammar mistakes: wrong verb tenses, incorrect word order, wrong prepositions, subject-verb agreement, wrong article (a/an/the), wrong word choice.

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

const translationCache = new Map()

export async function translateWord(word, context) {
  const key = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!key || key.length < 2) return null
  if (translationCache.has(key)) return translationCache.get(key)

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: `Translate the English word "${word}" to Catalan. Context: "${context}". Reply with ONLY the Catalan translation, nothing else. Maximum 6 words.` }],
    temperature: 0,
    max_tokens: 20,
  })

  const translation = response.choices[0].message.content.trim()
  translationCache.set(key, translation)
  return translation
}

export async function quickCorrection(userMessage, level) {
  const prompt = `English teacher checking a spoken message from a student (level ${level}): "${userMessage}"
The message comes from speech-to-text so it has no punctuation or capitals — do NOT flag that.
Only flag real grammar errors: wrong verb tense, wrong preposition, subject-verb disagreement, wrong article, wrong word order.
If there is a real grammar error, return ONLY this JSON:
{"has_error": true, "original": "...", "correction": "...", "tip": "...", "natural": "..."}
Where "natural" is the full sentence said correctly and naturally in English.
If the message is correct (or only has punctuation/capitalisation issues), return ONLY: {"has_error": false}
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

const LEVEL_PROFILES = {
  A1: 'Very short, simple sentences (5-8 words). Present simple only, avoid other tenses. No contractions (say "I am", not "I\'m"). No idioms or phrasal verbs. Only the most common, everyday words.',
  A2: 'Short sentences (8-12 words). Present and simple past only. Common contractions are fine (I\'m, don\'t, it\'s). No idioms. Everyday, concrete vocabulary — avoid abstract words.',
  B1: 'Natural sentence length. Mix present, past and present perfect. Contractions normal. The occasional common idiom is fine if the meaning is clear from context. Everyday + some topic-specific vocabulary.',
  B2: 'Natural, flowing sentences, sometimes with a subordinate clause. Full range of tenses. Use contractions, common idioms and phrasal verbs freely, as a native speaker would in casual conversation.',
  C1: 'Complex sentences with subordinate clauses and varied structure. Nuanced, precise vocabulary. Idioms, phrasal verbs and colloquial expressions used freely and without explanation.',
  C2: 'Near-native complexity and pace. Sophisticated, precise vocabulary, idiomatic and sometimes culturally-specific expressions. Do not simplify for the student — challenge them as you would a native speaker.',
}

export function buildConversationSystem(level, scenario, recentVocabulary = [], targetVocabulary = []) {
  const vocabNote = recentVocabulary.length > 0
    ? `\n- The student has recently used these words: ${recentVocabulary.slice(0, 25).join(', ')}. Naturally introduce NEW vocabulary they haven't seen yet, appropriate for level ${level}.`
    : `\n- Introduce varied, rich vocabulary appropriate for level ${level}.`

  const targetNote = targetVocabulary.length > 0
    ? `\n- The student just warmed up on these words: ${targetVocabulary.join(', ')}. Try to naturally use several of them during the conversation, so they get to practise them in context.`
    : ''

  const cityNote = scenario.cityFacts
    ? `\n\nAccurate city reference (use this to give correct information):\n${scenario.cityFacts}`
    : ''

  const levelProfile = LEVEL_PROFILES[level] || LEVEL_PROFILES.A1

  return `You are a friendly English conversation partner. The student's level is ${level}.
Scenario: ${scenario.description}
Role: ${scenario.aiRole}${cityNote}

Language level for ${level} (follow this closely): ${levelProfile}

Rules:
- Keep responses to 2-3 sentences max
- Ask one follow-up question to keep conversation going
- Be encouraging and natural
- NEVER correct errors mid-conversation — just model correct English naturally
- For travel scenarios: give accurate, helpful tourist information based on the city facts provided${vocabNote}${targetNote}`
}

export async function generateKeyVocabulary(scenario, level) {
  const prompt = `You are preparing a student (English level ${level}) for a roleplay conversation.
Scenario: ${scenario.description}
The AI will play: ${scenario.aiRole}

Pick 6 English words or short phrases that are likely to come up and are genuinely useful for this specific scenario, appropriate for level ${level}.

Respond with ONLY valid JSON, no markdown, no extra text:
[{"word": "...", "translation_ca": "...", "example": "..."}]

Where translation_ca is the Catalan translation, and example is a short natural English sentence using the word in this scenario's context.`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 500,
  })

  try {
    const words = JSON.parse(response.choices[0].message.content)
    return Array.isArray(words) ? words.slice(0, 8) : []
  } catch {
    return []
  }
}
