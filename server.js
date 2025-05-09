// server.js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ view engine 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ✅ express-ejs-layouts 사용
app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs 를 기본 레이아웃으로 사용

// ✅ body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 라우터 연결
app.use('/', indexRouter);

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
