const axios = require('axios');

// ML Service Base URL (configured via environment variable or default local endpoint)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 15000, // 15 seconds timeout for AI generation
});

/**
 * Generic helper function to forward requests to the ML microservice.
 * @param {string} endpoint - The target route path on the ML service.
 * @param {Object} payload - The request body data.
 * @returns {Promise<any>} - The response data from the ML service.
 */
const postToMLService = async (endpoint, payload) => {
  try {
    const response = await mlClient.post(endpoint, payload);
    if (response.data) {
      return response.data;
    }
    throw new Error('Invalid response structure received from ML service.');
  } catch (error) {
    console.error(`ML Service Error [${endpoint}]:`, error.message);
    throw new Error(`Failed to fetch response from AI ML service at ${endpoint}.`);
  }
};

/**
 * Forwards the AI Tutor prompt and context to the ML service.
 * @param {Object} payload - Contains message, subject, and topic.
 * @returns {Promise<string>} - The AI generated reply.
 */
exports.getAITutorResponseFromML = async ({ message, subject, topic }) => {
  const data = await postToMLService('/tutor', { message, subject, topic });
  if (data.reply) return data.reply;
  throw new Error('Reply property missing in ML service response.');
};

/**
 * Forwards the AI Quiz request to the ML service.
 * @param {Object} payload - Contains subject, topic, difficulty, etc.
 * @returns {Promise<Object>} - The generated quiz data.
 */
exports.getAIQuizResponseFromML = async (payload) => {
  return await postToMLService('/quiz', payload);
};

/**
 * Forwards the AI Notes request to the ML service.
 * @param {Object} payload - Contains subject, topic, or content parameters.
 * @returns {Promise<Object>} - The generated notes content.
 */
exports.getAINotesResponseFromML = async (payload) => {
  return await postToMLService('/notes', payload);
};

/**
 * Forwards assignment-related AI assistance or evaluation requests to the ML service.
 * @param {Object} payload - Contains assignment content, code, or context.
 * @returns {Promise<Object>} - The AI evaluation or generation result.
 */
exports.getAIAssignmentResponseFromML = async (payload) => {
  return await postToMLService('/assignment', payload);
};