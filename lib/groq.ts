import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.MODEL_KEY,
});

export const generateCompletion = async (prompt: string, systemPrompt?: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  });

  return chatCompletion.choices[0]?.message?.content || '';
};

export const generateJSON = async (prompt: string, systemPrompt?: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  });

  const content = chatCompletion.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
};

export default groq;
