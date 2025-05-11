// controllers/pdfController.js
const fs = require('fs');
const pdfParser = require('../utils/pdfParser');
const ollamaService = require('../utils/ollamaService');
const db = require('../config/db'); // DB 연결 풀 가져오기

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).render('index', { error: '파일이 업로드되지 않았습니다.' });
  }
  const filePath = req.file.path;
  const originalFilename = req.file.originalname;

  try {
    // PDF 파일에서 텍스트 추출
    const text = await pdfParser.parsePDF(filePath);

    // 추출한 텍스트를 Ollama 번역 서비스로 전송
    const translatedText = await ollamaService.translateText(text);

    // DB에 번역 결과 저장
    try {
      const [result] = await db.execute(
        'INSERT INTO translations (original_filename, original_text, translated_text) VALUES (?, ?, ?)',
        [originalFilename, text, translatedText]
      );
      console.log('Translation saved to DB, ID:', result.insertId);
    } catch (dbError) {
      console.error('Error saving translation to DB:', dbError);
      // DB 저장 실패가 전체 프로세스를 중단시키지는 않도록 처리 (선택적)
    }

    // 처리 후 임시 업로드 파일 삭제
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    // 결과 페이지 렌더링
    res.render('result', { originalText: text, translatedText: translatedText, originalFilename: originalFilename });

  } catch (error) {
    console.error('Error in handleUpload:', error);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after main error:', err);
      });
    }
    res.status(500).render('index', { error: '서버 오류가 발생했습니다: ' + error.message });
  }
};

// 과거 번역 이력 조회 핸들러
exports.getHistory = async (req, res) => {
  try {
    // DB에서 최근 번역 이력 조회 (예: 최근 20개, 최신순)
    const [rows] = await db.execute(
      'SELECT id, original_filename, LEFT(original_text, 200) AS original_text_preview, LEFT(translated_text, 200) AS translated_text_preview, created_at FROM translations ORDER BY created_at DESC LIMIT 20'
    );
    // LEFT(..., 200)은 텍스트 미리보기를 위해 앞부분 200자만 가져옵니다.

    res.render('history', { translations: rows });
  } catch (error) {
    console.error('Error fetching translation history:', error);
    res.status(500).render('error', { message: '이력 조회 중 오류가 발생했습니다.', error }); // error.ejs 필요
  }
};

// 특정 번역 이력 상세 조회 핸들러 (선택적 추가 기능)
exports.getTranslationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT original_filename, original_text, translated_text, created_at FROM translations WHERE id = ?',
      [id]
    );
    if (rows.length > 0) {
      res.render('result', { // result.ejs 재활용 또는 별도 상세 뷰
        originalText: rows[0].original_text,
        translatedText: rows[0].translated_text,
        originalFilename: rows[0].original_filename,
        isHistoryView: true // 이력 조회임을 구분하기 위한 플래그
      });
    } else {
      res.status(404).send('번역 기록을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('Error fetching translation by ID:', error);
    res.status(500).send('서버 오류');
  }
};