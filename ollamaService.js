// // utils/ollamaService.js
// const axios = require('axios');

// const CUSTOM_URL = "http://localhost:11434"; // Ollama 서버의 기본 URL

// exports.translateText = async (text) => {
//   try {
//     // 프롬프트 템플릿 구성
//     const prompt = `
// - you are a professional translator
// - translate the provided content into English
// - only respond with the translation
// ${text}
//     `;

//     // Ollama 서버에 POST 요청 (예시 API 엔드포인트: /api/generate)
//     const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
//       model: "llama3",
//       prompt: prompt,
//       stream: false,
//       temperature: 0,
//       num_predict: 200
//     });
    
//     // 응답 데이터에서 번역 결과 추출 (API 응답 형식에 따라 수정 필요)
//     return response.data.response || "No translation returned";
//   } catch (error) {
//     console.error('Error in translateText:', error);
//     throw new Error('Translation failed: ' + error.message);
//   }
// // };




// const axios = require('axios');

// const CUSTOM_URL = "http://localhost:11434"; // Ollama 서버의 기본 URL

// exports.translateText = async (text) => {
//   try {
//     // 번역 프롬프트 템플릿 구성
//     const prompt = `
// - You are a professional translator.
// - Translate the provided content into English.
// - Organize the translation neatly with clear formatting, preserving all original content.
// ${text}
//     `;

//     // 스트리밍 모드로 번역 요청
//     const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
//       model: "llama3",
//       prompt: prompt,
//       stream: true,
//       temperature: 0,
//       num_predict: 200
//     }, { responseType: 'stream' });

//     let fullTranslation = '';
//     let buffer = '';

//     return new Promise((resolve, reject) => {
//       response.data.on('data', (chunk) => {
//         buffer += chunk.toString();
//         const lines = buffer.split('\n');
//         buffer = lines.pop();
//         lines.forEach((line) => {
//           if (line.trim() !== '') {
//             try {
//               const json = JSON.parse(line);
//               fullTranslation += json.response;
//             } catch (error) {
//               console.error('JSON 파싱 에러:', error, '문자열:', line);
//             }
//           }
//         });
//       });

//       response.data.on('end', () => {
//         if (buffer.trim() !== '') {
//           try {
//             const json = JSON.parse(buffer);
//             fullTranslation += json.response;
//           } catch (error) {
//             console.error('마지막 buffer JSON 파싱 에러:', error, '문자열:', buffer);
//           }
//         }
//         resolve(fullTranslation);
//       });

//       response.data.on('error', (err) => {
//         reject(err);
//       });
//     });
//   } catch (error) {
//     console.error('Error in translateText:', error);
//     throw new Error('Translation failed: ' + error.message);
//   }
// };

// exports.summarizeText = async (text) => {
//   try {
//     // 요약 프롬프트 템플릿 구성
//     // 번역 기능은 제거하고, 원본 언어 그대로 요약하며 깔끔하게 정리하도록 지시
//     const prompt = `
// - You are a professional summarizer.
// - Summarize the provided content without translating it.
// - Keep the summary in the same language as the original.
// - Provide a concise, well-organized summary, using bullet points or short paragraphs where appropriate.
// - Format it neatly (e.g., headings, bullet lists) to make it easy to read.
// ${text}
//     `;

//     // 스트리밍 모드로 요약 요청
//     const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
//       model: "llama3",
//       prompt: prompt,
//       stream: true,
//       temperature: 0,
//       num_predict: 200
//     }, { responseType: 'stream' });

//     let fullSummary = '';
//     let buffer = '';

//     return new Promise((resolve, reject) => {
//       response.data.on('data', (chunk) => {
//         buffer += chunk.toString();
//         const lines = buffer.split('\n');
//         buffer = lines.pop();
//         lines.forEach((line) => {
//           if (line.trim() !== '') {
//             try {
//               const json = JSON.parse(line);
//               fullSummary += json.response;
//             } catch (error) {
//               console.error('JSON 파싱 에러:', error, '문자열:', line);
//             }
//           }
//         });
//       });

//       response.data.on('end', () => {
//         if (buffer.trim() !== '') {
//           try {
//             const json = JSON.parse(buffer);
//             fullSummary += json.response;
//           } catch (error) {
//             console.error('마지막 buffer JSON 파싱 에러:', error, '문자열:', buffer);
//           }
//         }
//         resolve(fullSummary);
//       });

//       response.data.on('error', (err) => {
//         reject(err);
//       });
//     });
//   } catch (error) {
//     console.error('Error in summarizeText:', error);
//     throw new Error('Summary failed: ' + error.message);
//   }
// };


const axios = require('axios');

const CUSTOM_URL = "http://localhost:11434"; // Ollama 서버의 기본 URL

exports.translateText = async (text) => {
  try {
    // 번역 프롬프트 템플릿 구성
    const prompt = `
- You are a professional translator.
- Translate the provided content into English.
- Organize the translation neatly with clear formatting, preserving all original content.
${text}
    `;

    // 스트리밍 모드로 번역 요청
    const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
      model: "llama3",
      prompt: prompt,
      stream: true,
      temperature: 0,
      num_predict: 200
    }, { responseType: 'stream' });

    let fullTranslation = '';
    let buffer = '';

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        lines.forEach((line) => {
          if (line.trim() !== '') {
            // JSON 객체로 보이는지 간단히 검사 (예: "{"로 시작하는지)
            if (!line.trim().startsWith('{')) {
              console.warn('JSON 형식 아님, 무시:', line);
              return;
            }
            try {
              const json = JSON.parse(line);
              fullTranslation += json.response;
            } catch (error) {
              console.error('JSON 파싱 에러:', error, '문자열:', line);
            }
          }
        });
      });

      response.data.on('end', () => {
        if (buffer.trim() !== '') {
          if (!buffer.trim().startsWith('{')) {
            console.warn('JSON 형식 아님, 무시:', buffer);
          } else {
            try {
              const json = JSON.parse(buffer);
              fullTranslation += json.response;
            } catch (error) {
              console.error('마지막 buffer JSON 파싱 에러:', error, '문자열:', buffer);
            }
          }
        }
        resolve(fullTranslation);
      });

      response.data.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error in translateText:', error);
    throw new Error('Translation failed: ' + error.message);
  }
};

exports.summarizeText = async (text) => {
  try {
    // 요약 프롬프트 템플릿 구성 (번역 없이 원본 언어 그대로 요약)
    const prompt = `
- You are a professional summarizer.
- Summarize the provided content without translating it.
- Keep the summary in the same language as the original.
- Provide a concise, well-organized summary, using bullet points or short paragraphs where appropriate.
- Format it neatly (e.g., headings, bullet lists) to make it easy to read.
${text}
    `;

    // 스트리밍 모드로 요약 요청
    const response = await axios.post(`${CUSTOM_URL}/api/generate`, {
      model: "llama3",
      prompt: prompt,
      stream: true,
      temperature: 0,
      num_predict: 200
    }, { responseType: 'stream' });

    let fullSummary = '';
    let buffer = '';

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        lines.forEach((line) => {
          if (line.trim() !== '') {
            if (!line.trim().startsWith('{')) {
              console.warn('JSON 형식 아님, 무시:', line);
              return;
            }
            try {
              const json = JSON.parse(line);
              fullSummary += json.response;
            } catch (error) {
              console.error('JSON 파싱 에러:', error, '문자열:', line);
            }
          }
        });
      });

      response.data.on('end', () => {
        if (buffer.trim() !== '') {
          if (!buffer.trim().startsWith('{')) {
            console.warn('JSON 형식 아님, 무시:', buffer);
          } else {
            try {
              const json = JSON.parse(buffer);
              fullSummary += json.response;
            } catch (error) {
              console.error('마지막 buffer JSON 파싱 에러:', error, '문자열:', buffer);
            }
          }
        }
        resolve(fullSummary);
      });

      response.data.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error in summarizeText:', error);
    throw new Error('Summary failed: ' + error.message);
  }
};
