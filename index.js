// routes/index.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');
const path = require('path');

// multer 설정: 업로드 파일은 uploads 폴더에 저장
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // uploads 폴더가 반드시 존재해야 함
  },
  filename: function (req, file, cb) {
    const originalnameDecoded = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(originalnameDecoded);
    const basename = path.basename(originalnameDecoded, extension).replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_.]/g, '_');
    cb(null, uniqueSuffix + '-' + basename + extension);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET: 업로드 폼 페이지 렌더링
router.get('/', (req, res) => {
  res.render('index', { error: null });
});

// POST: 파일 업로드 및 PDF 번역 처리
router.post('/upload', upload.single('pdfFile'), pdfController.handleUpload);

// GET: 과거 번역 이력 페이지
router.get('/history', pdfController.getHistory);

// GET: 특정 번역 이력 상세 보기 (선택적)
router.get('/translation/:id', pdfController.getTranslationById);


module.exports = router;