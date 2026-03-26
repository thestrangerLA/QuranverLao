const BASE_URL = 'https://api.quran.com/api/v4';

// Note: Lao translation might not be available in the main Quran.com API.
// We will use Thai (ID 33) as a fallback or look for Lao if available.
// Actually, let's check for Lao (lo) translation resources.
// If not found, we'll use Thai as it's linguistically close and often used by Lao speakers.

export const getSurahs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/chapters?language=en`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('Error in getSurahs:', error);
    throw error;
  }
};

export const getSurahVerses = async (surahId: number, translationIds: string | number = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/verses/by_chapter/${surahId}?language=en&words=false&translations=${translationIds}&fields=text_uthmani&per_page=500`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error('Error in getSurahVerses:', error);
    throw error;
  }
};

export const getTranslations = async () => {
  const response = await fetch(`${BASE_URL}/resources/translations`);
  const data = await response.json();
  return data.translations;
};

export const getTafsirList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/resources/tafsirs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tafsirs;
  } catch (error) {
    console.error('Error in getTafsirList:', error);
    throw error;
  }
};

export const getTafsir = async (tafsirId: number, verseKey: string) => {
  try {
    const response = await fetch(`${BASE_URL}/quran/tafsirs/${tafsirId}?verse_key=${verseKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tafsirs?.[0] || null;
  } catch (error) {
    console.error('Error in getTafsir:', error);
    throw error;
  }
};
