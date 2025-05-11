// config/db.js
const mysql = require('mysql2/promise'); // mysql2의 promise 기반 API 사용
const pool = mysql.createPool({
host: 'localhost',         // 두 번째 스크린샷에서 확인됨
user: 'root',              // 두 번째 스크린샷에서 확인됨
password: 'hanjaewoong1', // MySQL root 사용자의 비밀번호 (여전히 직접 입력 필요)
database: 'pdf_translator_db', // 첫 번째 스크린샷의 SQL 쿼리에서 확인됨
port: 3306,                // 두 번째 스크린샷에서 확인됨 (기본값이므로 생략 가능)
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});
module.exports = pool;