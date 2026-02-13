
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Models
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20240620';
const OPENAI_MODEL = 'gpt-4o';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Updated to supported model

// Determine Provider
const getProvider = () => {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
};

// Initialize Clients
let anthropic, openai, geminiModel, groq;

if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

if (process.env.GROQ_API_KEY) {
    groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
}

async function processStep(text, stepType, customInstructions) {
  const provider = getProvider();
  if (!provider) {
    throw new Error('No valid API key found for Anthropic, OpenAI, Gemini, or Groq.');
  }

  let systemPrompt = '';
  let userPrompt = `Input text:\n${text}`;

  switch (stepType) {
    case 'Clean Text':
      systemPrompt = 'You are a text cleaner. Remove extra whitespace, fix formatting, and normalize the text. Do not summarize or change the meaning. Return only the cleaned text.';
      break;
    case 'Summarize':
      systemPrompt = 'You are a summarizer. Create a concise summary of the input text.';
      break;
    case 'Translate':
      systemPrompt = 'You are a translator. Translate the input text to the target language specified in the instructions. If no language is specified, translate to English.';
      break;
    case 'Simplify Language':
      systemPrompt = 'You are a language simplifier. Rewrite the text to make it easier to read and understand, using simple vocabulary and short sentences. Aim for a 5th-grade reading level.';
      break;
    default:
      systemPrompt = 'Process the text according to the user instructions.';
  }

  if (customInstructions) {
    systemPrompt += `\n\nAdditional Instructions:\n${customInstructions}`;
  }

  try {
    if (provider === 'groq') {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: GROQ_MODEL,
        });
        return completion.choices[0].message.content;

    } else if (provider === 'openai') {
      const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: OPENAI_MODEL,
      });
      return completion.choices[0].message.content;

    } else if (provider === 'gemini') {
      // Gemini doesn't have system prompts in the same way for the basic API, 
      // so we prepend it or use the system instruction if supported (v1beta).
      // For simplicity/compatibility, we'll prepend to the user prompt.
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await geminiModel.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();

    } else {
      // Anthropic
      const message = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      });
      return message.content[0].text;
    }

  } catch (error) {
    console.error('LLM Error:', error);
    throw new Error(`LLM processing failed [${provider}]: ${error.message}`);
  }
}

async function checkLlmStatus() {
    const provider = getProvider();
    if (!provider) throw new Error("No API key configured");

    try {
        if (provider === 'groq') {
            await groq.chat.completions.create({
                messages: [{ role: "user", content: "Ping" }],
                model: GROQ_MODEL,
                max_tokens: 5
            });
        } else if (provider === 'openai') {
            await openai.chat.completions.create({
                messages: [{ role: "user", content: "Ping" }],
                model: "gpt-3.5-turbo", // Use cheaper model for ping
                max_tokens: 5
            });
        } else if (provider === 'gemini') {
            await geminiModel.generateContent("Ping");
        } else {
            await anthropic.messages.create({
                model: ANTHROPIC_MODEL,
                max_tokens: 5,
                messages: [{ role: 'user', content: 'Ping' }]
            });
        }
        return true;
    } catch (e) {
        console.error("LLM Check Failed:", e);
        throw e;
    }
}

module.exports = { processStep, checkLlmStatus };
