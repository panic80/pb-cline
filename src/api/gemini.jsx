import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTravelInstructions } from './travelInstructions';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const sendToGemini = async (
  message,
  isSimplified = false,
  model = 'models/gemini-2.0-flash-001',
  preloadedInstructions = null
) => {
  try {
    // Ensure we have travel instructions
    if (!preloadedInstructions) {
      throw new Error('Travel instructions not loaded');
    }

    // Check if we're in development or production
    const isDevelopment = import.meta.env.DEV;
    let result;

    if (isDevelopment) {
      try {
        // In development, use the proxy endpoint
        const promptText = `You are a helpful assistant for Canadian Forces Travel Instructions.
Here is the ONLY source material you can reference:
${preloadedInstructions}

Question: ${message}


Please provide a response in this EXACT format:

Reference: <provide the section or chapter reference from the source>
Quote: <provide the exact quote that contains the answer>
${isSimplified ?
  'Answer: <provide a concise answer in no more than two sentences>' :
  'Answer: <provide a succinct one-sentence reply>\nReason: <provide a comprehensive explanation and justification drawing upon the source material>'}`;

        const requestBody = {
          model: model.includes('/') ? model.split('/')[1].replace('-001', '') : model,
          prompt: promptText,
          generationConfig: {
            temperature: 0.1,
            topP: 0.1,
            topK: 1,
            maxOutputTokens: 2048
          }
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
        console.log('Gemini API Response:', JSON.stringify(data, null, 2));

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Invalid response format from Gemini API');
        }

        const text = data.candidates[0].content.parts[0].text;
        const sections = text.split('\n').filter(line => line.trim());
        
        const reference = sections.find(line => line.startsWith('Reference:'))?.replace('Reference:', '').trim();
        const quote = sections.find(line => line.startsWith('Quote:'))?.replace('Quote:', '').trim();
        const answer = sections.find(line => line.startsWith('Answer:'))?.replace('Answer:', '').trim();
        const reason = sections.find(line => line.startsWith('Reason:'))?.replace('Reason:', '').trim();

        if (!answer) {
          throw new Error('Response missing required answer section');
        }

        const formattedText = isSimplified ? answer : (reason ? `${answer}\n\nReason: ${reason}` : answer);
        return {
          text: formattedText,
          sources: quote ? [{ text: quote, reference }] : []
        };
      } catch (proxyError) {
        console.warn('Proxy API call failed, falling back to direct SDK:', proxyError);
        // Fall back to direct SDK call
      }
    }

    // Direct SDK call (used in production or as fallback in development)
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Extract the model name from the format 'models/gemini-2.0-flash-001'
    const modelName = model.includes('/') ? model.split('/')[1].replace('-001', '') : model;
    const genModel = genAI.getGenerativeModel({ model: modelName });

    // Prepare the prompt
    const prompt = `You are a helpful assistant for Canadian Forces Travel Instructions.
Here is the ONLY source material you can reference:
${preloadedInstructions}

Question: ${message}


Please provide a response in this EXACT format:

Reference: <provide the section or chapter reference from the source>
Quote: <provide the exact quote that contains the answer>
${isSimplified ?
  'Answer: <provide a concise answer in no more than two sentences>' :
  'Answer: <provide a succinct one-sentence reply>\nReason: <provide a comprehensive explanation and justification drawing upon the source material>'}`;

    // Set generation config
    const generationConfig = {
      temperature: 0.1,
      topP: 0.1,
      topK: 1,
      maxOutputTokens: 2048
    };

    // Generate content using the SDK - using the correct format for the Gemini API
    result = await genModel.generateContent(prompt, generationConfig);

    console.log('Gemini API Response:', JSON.stringify(result, null, 2));

    // Extract the text from the response
    const text = result.response.text();
    
    if (!text) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Parse the response similar to the original implementation
    const sections = text.split('\n').filter(line => line.trim());
    
    const reference = sections.find(line => line.startsWith('Reference:'))?.replace('Reference:', '').trim();
    const quote = sections.find(line => line.startsWith('Quote:'))?.replace('Quote:', '').trim();
    const answer = sections.find(line => line.startsWith('Answer:'))?.replace('Answer:', '').trim();
    const reason = sections.find(line => line.startsWith('Reason:'))?.replace('Reason:', '').trim();

    if (!answer) {
      throw new Error('Response missing required answer section');
    }

    const formattedText = isSimplified ? answer : (reason ? `${answer}\n\nReason: ${reason}` : answer);
    const responseData = {
      text: formattedText,
      sources: quote ? [{ text: quote, reference }] : []
    };

    return responseData;

  } catch (error) {
    console.error('Gemini API Error:', {
      message: error.message,
      stack: error.stack
    });
    
    throw error;
  }
};
