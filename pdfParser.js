// utils/pdfParser.js
const fs = require('fs');
const pdf = require('pdf-parse');

exports.parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    // data.text에 추출된 텍스트가 있음
    return data.text;
  } catch (error) {
    throw new Error('Error parsing PDF: ' + error.message);
  }
};


