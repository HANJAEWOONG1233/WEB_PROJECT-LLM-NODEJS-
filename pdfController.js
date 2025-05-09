// controllers/pdfController.js
const fs = require('fs');
const pdfParser = require('../utils/pdfParser');
const ollamaService = require('../utils/ollamaService');

exports.handleUpload = async (req, res) => {
  try {
    const filePath = req.file.path;
    // PDF 파일에서 텍스트 추출
    const originalText = await pdfParser.parsePDF(filePath);
    // 추출한 텍스트를 번역 (프롬프트 및 후처리 적용됨)
    const translatedText = await ollamaService.translateText(originalText);
    
    // 업로드된 파일 삭제 (옵션)
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
    // 번역 결과 렌더링 (views/result.ejs)
    res.render('result', { originalText, translatedText });
  } catch (error) {
    console.error('Error in handleUpload:', error);
    res.status(500).send('Server Error');
  }
};
