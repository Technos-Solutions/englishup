// Language-aware content layer. Components call these getters with the
// current target language code ('en' | 'ga') instead of importing the
// English data files directly, so the same screens work for either
// learning track.
import { SCENARIOS as SCENARIOS_EN, LISTENING_WORDS as LISTENING_WORDS_EN, SHADOWING_SENTENCES as SHADOWING_SENTENCES_EN } from './scenarios'
import { SCENARIOS as SCENARIOS_GA, LISTENING_WORDS as LISTENING_WORDS_GA, SHADOWING_SENTENCES as SHADOWING_SENTENCES_GA } from './scenarios.ga'
import { GRAMMAR_TOPICS as GRAMMAR_TOPICS_EN, TAG_TO_TOPIC as TAG_TO_TOPIC_EN } from './grammar'
import { GRAMMAR_TOPICS as GRAMMAR_TOPICS_GA, TAG_TO_TOPIC as TAG_TO_TOPIC_GA } from './grammar.ga'
import { IRREGULAR_VERBS as IRREGULAR_VERBS_EN } from './verbs'
import { IRREGULAR_VERBS as IRREGULAR_VERBS_GA } from './verbs.ga'
import { PRONOUNS as PRONOUNS_EN, PRONOUN_CATEGORIES as PRONOUN_CATEGORIES_EN } from './pronouns'
import { PRONOUNS as PRONOUNS_GA, PRONOUN_CATEGORIES as PRONOUN_CATEGORIES_GA } from './pronouns.ga'
import { MODAL_EXERCISES as MODAL_EXERCISES_EN } from './modals'
import { MODAL_EXERCISES as MODAL_EXERCISES_GA } from './modals.ga'

export function getScenarios(lang) {
  return lang === 'ga' ? SCENARIOS_GA : SCENARIOS_EN
}

export function getListeningWords(lang) {
  return lang === 'ga' ? LISTENING_WORDS_GA : LISTENING_WORDS_EN
}

export function getShadowingSentences(lang) {
  return lang === 'ga' ? SHADOWING_SENTENCES_GA : SHADOWING_SENTENCES_EN
}

export function getGrammarTopics(lang) {
  return lang === 'ga' ? GRAMMAR_TOPICS_GA : GRAMMAR_TOPICS_EN
}

export function getTagToTopic(lang) {
  return lang === 'ga' ? TAG_TO_TOPIC_GA : TAG_TO_TOPIC_EN
}

export function getIrregularVerbs(lang) {
  return lang === 'ga' ? IRREGULAR_VERBS_GA : IRREGULAR_VERBS_EN
}

export function getPronouns(lang) {
  return lang === 'ga' ? PRONOUNS_GA : PRONOUNS_EN
}

export function getPronounCategories(lang) {
  return lang === 'ga' ? PRONOUN_CATEGORIES_GA : PRONOUN_CATEGORIES_EN
}

export function getModalExercises(lang) {
  return lang === 'ga' ? MODAL_EXERCISES_GA : MODAL_EXERCISES_EN
}
