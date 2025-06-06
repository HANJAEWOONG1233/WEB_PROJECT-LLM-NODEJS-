# PDF 번역 서비스 (PDF Translator)

**로컬 Ollama LLM과 MySQL을 활용한 PDF 문서 번역 및 이력 관리 웹 서비스**

이 프로젝트는 사용자가 PDF 파일을 업로드하면 해당 파일의 텍스트를 추출하여 로컬에서 실행 중인 Ollama LLM (예: Llama3)을 통해 영어로 번역하고, 번역된 결과를 사용자에게 보여주는 웹 애플리케이션입니다. 또한, 번역된 내용은 MySQL 데이터베이스에 저장되어 과거 번역 이력을 조회할 수 있는 기능을 제공합니다.

![image](https://github.com/user-attachments/assets/3fb62501-f467-431a-ba73-67e91f67c27a)

![image](https://github.com/user-attachments/assets/616759e8-963b-4a93-a884-e6ff4bbbfc0e)


## ✨ 주요 기능

*   **PDF 파일 업로드**: 사용자는 로컬 장치에서 PDF 파일을 선택하여 업로드할 수 있습니다.
*   **텍스트 추출**: 업로드된 PDF 파일에서 텍스트 내용을 자동으로 추출합니다. (`pdf-parse` 라이브러리 사용)
*   **LLM 기반 번역**: 추출된 텍스트를 로컬 Ollama LLM (Llama3 모델 사용)으로 전송하여 영어로 번역합니다.
*   **결과 표시**: 원문 텍스트와 번역된 텍스트를 나란히 보여줍니다.
*   **번역 이력 저장**: 번역된 원문, 번역문, 원본 파일명 등을 MySQL 데이터베이스에 저장합니다.
*   **과거 이력 조회**: 저장된 번역 이력을 목록 형태로 확인하고, 각 항목의 상세 내용을 다시 볼 수 있습니다.

## 🛠️ 사용 기술

*   **백엔드**: Node.js, Express.js
*   **프론트엔드**: EJS (Embedded JavaScript templates), HTML, CSS
*   **PDF 처리**: `pdf-parse` (텍스트 추출)
*   **LLM 연동**: Ollama (Llama3 모델), `axios` (API 요청)
*   **데이터베이스**: MySQL, `mysql2` (Node.js 드라이버)
*   **파일 업로드**: `multer`
*   **레이아웃**: `express-ejs-layouts`

## 🚀 시작 가이드

### 사전 요구 사항

*   Node.js (버전 16.x 이상 권장)
*   npm (Node.js 설치 시 함께 설치됨)
*   MySQL 서버 설치 및 실행
*   Ollama 설치 및 실행 (Llama3 모델 다운로드 필요: `ollama pull llama3`)
    *   Ollama 서버는 기본적으로 `http://localhost:11434`에서 실행됩니다.

### 설치 및 실행 방법

1.  **프로젝트 클론:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

2.  **필요한 패키지 설치:**
    ```bash
    npm install
    ```

3.  **데이터베이스 설정:**
        MySQL 서버에 접속하여 데이터베이스와 테이블을 생성합니다. (아래 SQL 쿼리 실행)
    
        ```sql
        CREATE DATABASE pdf_translator_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        USE pdf_translator_db;
        CREATE TABLE translations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          original_filename VARCHAR(255) NOT NULL,
          original_text LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          translated_text LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX idx_created_at ON translations (created_at);
        ```
    
       `config/db.js` 파일을 열어 실제 MySQL 접속 정보(`user`, `password`)로 수정합니다.
    
        ```javascript
        // config/db.js 예시
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({
          host: 'localhost',
          user: 'YOUR_MYSQL_USER', // 실제 MySQL 사용자명으로 변경
          password: 'YOUR_MYSQL_PASSWORD', // 실제 MySQL 비밀번호로 변경
          database: 'pdf_translator_db',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        module.exports = pool;
        ```

5.  **`uploads` 폴더 생성:**
    프로젝트 루트 디렉토리에 `uploads` 폴더를 생성합니다. 이 폴더는 업로드된 PDF 파일이 임시로 저장되는 곳입니다.
    ```bash
    mkdir uploads
    ```

6.  **애플리케이션 실행:**
    ```bash
    npm start
    ```
    (또는 `node server.js` / 개발 중에는 `nodemon server.js`)

7.  **웹 브라우저에서 접속:**
    `http://localhost:8000` (또는 `server.js`에 설정된 포트 번호)으로 접속합니다.

---

## 🔮 향후 개선 방향 (선택 사항)

*   더 다양한 언어 번역 지원
*   번역 품질 향상을 위한 프롬프트 엔지니어링 고도화
*   사용자 인증 기능 추가 (사용자별 번역 이력 관리)
*   비동기 처리 및 로딩 UI 개선 (대용량 파일 처리 시)
*   OCR 기능 추가 (이미지 기반 PDF 지원)
*   Docker를 이용한 배포 간소화

## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE.md)를 따릅니다. (필요시 LICENSE.md 파일 추가)



## 📂 폴더 구조 (주요 파일)

```text
.
├── config/
│   └── db.js               # 데이터베이스 연결 설정
├── controllers/
│   └── pdfController.js    # PDF 업로드, 번역, 이력 처리 로직
├── public/
│   └── css/
│       └── style.css       # CSS 스타일
├── routes/
│   └── index.js            # 라우팅 정의
├── utils/
│   ├── ollamaService.js    # Ollama LLM 연동 서비스
│   └── pdfParser.js        # PDF 텍스트 추출 유틸리티
├── views/
│   ├── history.ejs         # 번역 이력 페이지
│   ├── index.ejs           # 메인 업로드 페이지
│   ├── layout.ejs          # 기본 레이아웃
│   └── result.ejs          # 번역 결과 페이지
│   └── error.ejs           # (선택적: 오류 페이지)
├── uploads/                # 업로드된 파일 임시 저장 (Git에는 포함하지 않음 - .gitignore 처리)
├── .gitignore              # Git 추적 제외 파일/폴더 목록
├── package-lock.json
├── package.json
├── server.js               # 메인 서버 파일
└── README.md
