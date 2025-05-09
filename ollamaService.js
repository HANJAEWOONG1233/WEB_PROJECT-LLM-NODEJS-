// utils/ollamaService.js
const axios = require('axios');

const CUSTOM_URL = "http://localhost:11434"; // Ollama 서버 기본 URL

exports.translateText = async (text) => {
  try {
    // 번역 프롬프트 템플릿 (구조화된 번역 결과 유도)
    const prompt = `
You are a professional translator.
Translate the following text into English.
- Preserve the original paragraph structure if possible.
- Use bullet points or line breaks to separate ideas.
- Format the translation neatly for better readability.
- Only respond with the translation (no extra text).

${text}
    `;
    
    // Ollama 서버에 POST 요청
    const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
      model: "llama3",
      prompt: prompt,
      stream: false,
      temperature: 0,
      num_predict: 8000
    });
    
    // 번역 결과 추출 및 후처리: 문장마다 줄바꿈 추가
    let translation = response.data.response || "No translation returned";
    translation = translation.replace(/\. /g, '.\n');
    
    return translation;
  } catch (error) {
    console.error('Error in translateText:', error);
    throw new Error('Translation failed: ' + error.message);
  }
};
