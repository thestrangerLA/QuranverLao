export interface Surah {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_complex: string;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: {
    id: number;
    resource_id: number;
    text: string;
  }[];
}

export interface TranslationResource {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
}
