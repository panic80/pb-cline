import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTravelInstructions } from './travelInstructions';
import { parseApiResponse } from '../utils/chatUtils';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Creates a prompt for the Gemini API
 * @param {string} message - User message
 * @param {boolean} isSimplified - Whether to return simplified output
 * @param {string} instructions - Context for the AI
 * @returns {string} Formatted prompt
 */
export const createPrompt = (message, isSimplified = false, instructions) => {
  return `You are a helpful assistant for Canadian Forces Travel Instructions.
Here is the ONLY source material you can reference:
${instructions}

Question: ${message}


Please provide a response in this EXACT format:

Reference: <provide the section or chapter reference from the source>
Quote: <provide the exact quote that contains the answer>
${isSimplified ?
  'Answer: <provide a concise answer in no more than two sentences>' :
  'Answer: <provide a succinct one-sentence reply>\nReason: <provide a comprehensive explanation and justification drawing upon the source material>'}`;
};

/**
 * Get standard generation config for Gemini API
 * @returns {Object} Generation configuration
 */
export const getGenerationConfig = () => ({
  temperature: 0.1,
  topP: 0.1,
  topK: 1,
  maxOutputTokens: 2048
});

/**
 * Call Gemini API via proxy endpoint in development
 * @param {string} message - User message
 * @param {boolean} isSimplified - Whether to show simplified response
 * @param {string} model - The model to use
 * @param {string} instructions - Context for the AI
 * @returns {Promise<Object>} Response with text and sources
 */
export const callGeminiViaProxy = async (message, isSimplified, model, instructions) => {
  const promptText = createPrompt(message, isSimplified, instructions);
  
  const modelName = "model/google-2.0-flash";
  const requestBody = {
    model: modelName,
    prompt: promptText,
    generationConfig: getGenerationConfig()
  };

  const response = await fetch(`/api/gemini/generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Gemini API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Gemini API Response (Proxy):', JSON.stringify(data, null, 2));

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response format from Gemini API');
  }

  const text = data.candidates[0].content.parts[0].text;
  return parseApiResponse(text, isSimplified);
};

/**
 * Call Gemini API directly via SDK
 * @param {string} message - User message
 * @param {boolean} isSimplified - Whether to show simplified response
 * @param {string} model - The model to use
 * @param {string} instructions - Context for the AI
 * @returns {Promise<Object>} Response with text and sources
 */
export const callGeminiViaSDK = async (message, isSimplified, model, instructions) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Extract the model name from the format 'models/gemini-2.0-flash-001'
  const modelName = "model/google-2.0-flash";
  const genModel = genAI.getGenerativeModel({ model: modelName });

  // Prepare the prompt and config
  const prompt = createPrompt(message, isSimplified, instructions);
  // const generationConfig = getGenerationConfig();
  const generationConfig = {
    temperature: 0.1,
    topP: 0.1,
    topK: 1,
    maxOutputTokens: 2048
  };

  // Generate content using the SDK
  const result = await genModel.generateContent(prompt, generationConfig);
  console.log('Gemini API Response (SDK):', JSON.stringify(result, null, 2));

  // Extract and parse the text response
  const text = result.response.text();
  if (!text) {
    throw new Error('Invalid response format from Gemini API');
  }

  return parseApiResponse(text, isSimplified);
};

/**
 * Send message to Gemini API
 * @param {string} message - User message
 * @param {boolean} isSimplified - Whether to show simplified response
 * @param {string} model - The model to use
 * @param {string} preloadedInstructions - Preloaded travel instructions
 * @returns {Promise<Object>} Response with text and sources
 */
export const sendToGemini = async (
  message,
  isSimplified = false,
  model = 'gemini-2.0-flash',
  preloadedInstructions = null
) => {
  try {
    // Ensure we have travel instructions
    if (!preloadedInstructions) {
      throw new Error('Travel instructions not loaded');
    }

    // Check if we're in development or production
    // const isDevelopment = import.meta.env.DEV;
    
    // if (isDevelopment) {
    //   try {
    //     // In development, try the proxy endpoint first
    //     return await callGeminiViaProxy(message, isSimplified, model, preloadedInstructions);
    //   } catch (proxyError) {
    //     console.warn('Proxy API call failed, falling back to direct SDK:', proxyError);
    //     // Fall back to direct SDK call
    //   }
    // }

    // Direct SDK call (used in production or as fallback in development)
    return await callGeminiViaSDK(message, isSimplified, model, preloadedInstructions);

  } catch (error) {
    console.error('Gemini API Error:', {
      message: error.message,
      stack: error.stack
    });
    
    throw error;
  }
};
