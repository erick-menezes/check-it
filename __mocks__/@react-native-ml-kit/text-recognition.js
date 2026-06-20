const recognize = jest.fn(async () => ({ text: '', blocks: [] }));

const TextRecognitionScript = {
  LATIN: 'Latin',
  CHINESE: 'Chinese',
  DEVANAGARI: 'Devanagari',
  JAPANESE: 'Japanese',
  KOREAN: 'Korean',
};

module.exports = {
  __esModule: true,
  default: { recognize },
  TextRecognitionScript,
};
