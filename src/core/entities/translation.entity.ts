export interface TranslationEntity {
  id: number;
  verseId: number;
  verse: verseTranslation;
  languageCode: string;
  translation: string;
  translator: string;
  createdAt: string;
  updatedAt: string;
}

export interface verseTranslation {
  id: number;
  arabicText: string;
}

export interface VerseDropdown {
  id: number;
  arabicText: string;
}
