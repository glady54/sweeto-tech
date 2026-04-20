import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generates a professional product description based on an image and optional metadata.
 * 
 * @param {string} base64Image - The Base64 data URL of the product image.
 * @param {string} apiKey - The Google Gemini API Key.
 * @param {string} language - The language to generate the description in (e.g., 'en', 'fr').
 * @param {object} metadata - Optional context like product name or category.
 * @param {string} modelName - The Gemini model to use (default: 'gemini-1.5-flash').
 * @returns {Promise<string>} - The generated description.
 */
export const generateAIProductDescription = async (base64Image, apiKey, language = 'en', metadata = {}, modelName = 'gemini-1.5-flash') => {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  if (!base64Image) {
    throw new Error('MISSING_IMAGE');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the model name provided or fallback
    const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-flash" });

    // Clean up the base64 string and extract mimeType
    const mimeMatch = base64Image.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = base64Image.split(',')[1];
    
    const prompt = `
      You are a professional e-commerce copywriting expert for a premium electronics store called 'Sweeto-Tech'.
      Analyze the provided image and generate a compelling, high-end product description.
      
      Requirements:
      - Language: Generate the response completely in ${language === 'fr' ? 'French' : 'English'}.
      - Content: Focus on features, benefits for the user, and tech specs if visible.
      - Style: Professional, persuasive, and sleek.
      - Formatting: Use concise paragraphs. Avoid bullet points if possible, but keep it readable.
      - Product Context: ${metadata.name ? `The product name is "${metadata.name}".` : 'Identify the product from the image.'}
      
      Write ONLY the description itself. Do not include any intros or outros.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('api key not valid') || errorMessage.includes('invalid api key')) {
      throw new Error('INVALID_API_KEY');
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      throw new Error('AI_QUOTA_EXCEEDED');
    }

    if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
      throw new Error('AI_SAFETY_BLOCK');
    }

    if (errorMessage.includes('overload') || errorMessage.includes('503') || errorMessage.includes('unavailable')) {
      throw new Error('AI_MODEL_OVERLOADED');
    }

    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      console.warn("Model not found. Attempting to fetch a list of models your API key has access to...");
      try {
        // Use standard fetch to call the REST API as the browser SDK doesn't expose listModels easily
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (response.ok) {
          const data = await response.json();
          if (data.models) {
            console.log("Success! Here are the models available to your API key:");
            console.table(data.models.map(m => ({ 
              name: m.name.replace('models/', ''), 
              displayName: m.displayName,
              methods: m.supportedGenerationMethods?.join(', ')
            })));
            console.log("Recommended Vision Models: gemini-1.5-flash, gemini-1.5-pro");
          } else {
            console.warn("No models returned in metadata. Please verify your project has the 'Generative Language API' enabled in Google Cloud Console.");
          }
        } else {
          console.error(`Failed to list models via REST API (Status: ${response.status}).`);
          if (response.status === 403) {
            console.error("This usually means the 'Generative Language API' is not enabled or the key is restricted.");
          }
        }
      } catch (e) {
        console.error("Network error while listing models:", e);
      }
      
      console.log("TROUBLESHOOTING: Please check your API key in Google AI Studio (aistudio.google.com). Ensure you are using the correct model name (e.g., 'gemini-1.5-flash').");
      throw new Error('AI_MODEL_NOT_FOUND');
    }

    // Pass through the actual error message to help the user debug
    throw new Error(`AI_GEN_ERROR: ${error.message || 'Unknown failure'}`);
  }
};

/**
 * Tests the Gemini API connection by attempting to list models.
 * @param {string} apiKey - The API key to test.
 * @returns {Promise<{success: boolean, message: string, models?: any[]}>}
 */
export const testGeminiConnection = async (apiKey) => {
  if (!apiKey) return { success: false, message: 'MISSING_KEY' };
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (response.ok) {
      if (data.models && data.models.length > 0) {
        return { 
          success: true, 
          message: 'READY', 
          models: data.models.map(m => m.name.replace('models/', '')) 
        };
      }
      return { success: false, message: 'NO_MODELS_FOUND' };
    } else {
      if (response.status === 400) return { success: false, message: 'INVALID_KEY' };
      if (response.status === 403) return { success: false, message: 'API_NOT_ENABLED' };
      return { success: false, message: data.error?.message || 'UNKNOWN_ERROR' };
    }
  } catch (err) {
    return { success: false, message: 'NETWORK_ERROR' };
  }
};
