const BASE_URL = 'https://api.quran.com/api/v4';

// Note: Lao translation might not be available in the main Quran.com API.
// We will use Thai (ID 33) as a fallback or look for Lao if available.
// Actually, let's check for Lao (lo) translation resources.
// If not found, we'll use Thai as it's linguistically close and often used by Lao speakers.

export const getSurahs = async () => {
  const response = await fetch(`${BASE_URL}/chapters?language=en`);
  const data = await response.json();
  return data.chapters;
};

export const getSurahVerses = async (surahId: number, translationId: number = 20) => {
  const response = await fetch(
    `${BASE_URL}/verses/by_chapter/${surahId}?language=en&words=false&translations=${translationId}&fields=text_uthmani&per_page=500`
  );
  const data = await response.json();
  return data.verses;
};

export const getTranslations = async () => {
  const response = await fetch(`${BASE_URL}/resources/translations`);
  const data = await response.json();
  return data.translations;
};
