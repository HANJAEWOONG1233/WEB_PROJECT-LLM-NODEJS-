// utils/pdfParser.js
const fs = require('fs');
const pdf = require('pdf-parse');

exports.parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Error parsing PDF: ' + error.message);
  }
};
