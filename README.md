# PDF Translator & Summarizer

A web application that allows users to upload PDF documents, automatically extract the text, and either:

- **Translate** the content into English using a local LLM (LLaMA3 via Ollama), or
- **Summarize** the content while preserving the original language.

Built using Node.js, Express, and EJS templating, with real-time stream parsing from a local LLM.

---

## Features

- 📄 **Upload** PDF files via browser  
- 🤖 Use local LLM (Ollama) to handle:  
  - English translation (with formatting preserved)  
  - Original-language summarization (clean, structured)  
- 🧠 **Markdown formatting** via `marked` for neat HTML output  
- ⚡ **Real-time stream parsing**: parses JSON chunks from Ollama line-by-line  
- 🧹 **Automatic cleanup**: uploaded files deleted after processing  

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Templating:** EJS  
- **File Handling:** Multer  
- **PDF Parsing:** pdf-parse  
- **LLM:** Local Ollama server (LLaMA3 model)  
- **Markdown Rendering:** marked  

---

## Project Structure

```plaintext
project/
├── controllers/          # Request handling logic
│   └── pdfController.js
├── routes/               # Express route definitions
│   └── index.js
├── utils/                # Utility modules
│   ├── ollamaService.js  # LLM integration
│   └── pdfParser.js      # PDF text extraction
├── views/                # EJS templates (UI rendering)
│   ├── index.ejs
│   ├── result.ejs
│   └── layout.ejs
├── public/               # Static files (CSS, images)
│   └── css/style.css
├── uploads/              # Temp uploaded PDFs (auto-deleted)
├── server.js             # Main Express server
├── package.json
└── .gitignore

---


## Notes

- **Streaming Handling:** We manually parse each JSON line from the stream, filter out noise (e.g., incomplete chunks, system logs), and combine the meaningful `response` fields.
- **Postprocessing:** Text is cleaned for duplicate lines, HTML entities, and structured via Markdown.
- **Security:** `.env` and `uploads/` should be `.gitignore`d for safety.

---

## Future Improvements

- Language selection for translation output  
- Chunked handling for very large PDFs  
- Upload progress bar and loader UI  
- REST API endpoints for external integrations  

