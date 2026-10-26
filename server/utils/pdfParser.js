import pdf from 'pdf-parse/lib/pdf-parse.js';

export const parsePdfBuffer = async (buffer) => {
  try {
    const data = await pdf(buffer);
    const cleanedText = (data.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (cleanedText && cleanedText.length >= 20) {
      return {
        text: cleanedText,
        numPages: data.numpages || 1,
        info: data.info || {}
      };
    }
  } catch (error) {
    console.warn('⚠️ Primary PDF parser encountered an error:', error.message);
  }

  // Fallback: extract readable text from PDF streams if pdf.js failed
  try {
    const rawStr = buffer.toString('binary');
    const matches = rawStr.match(/\(([^()]{2,})\)/g) || [];
    const extracted = matches
      .map(m => m.slice(1, -1))
      .join(' ')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (extracted && extracted.length >= 30) {
      console.log('✅ Recovered resume text using raw stream fallback parser.');
      return {
        text: extracted,
        numPages: 1,
        info: {}
      };
    }
  } catch (fallbackErr) {
    console.error('Fallback PDF parser also failed:', fallbackErr.message);
  }

  throw new Error('Extracted text from PDF is empty or unreadable.');
};
