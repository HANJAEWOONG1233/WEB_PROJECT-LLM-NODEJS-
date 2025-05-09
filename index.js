// routes/index.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfController = require('../controllers/pdfController');

// uploads 폴더 경로 설정 및 자동 생성
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// multer 저장 설정: 파일은 uploads 폴더에 저장
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// GET: 업로드 폼 페이지 렌더링
router.get('/', (req, res) => {
  res.render('index');
});

// POST: PDF 파일 업로드 및 번역 처리
router.post('/upload', upload.single('pdfFile'), pdfController.handleUpload);

module.exports = router;
