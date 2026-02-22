import React, { useState } from 'react';
import { VerseDropdown } from '@/core/entities';
import { CloseIcon, ChevronDownIcon } from '../base/icons';

interface TranslationFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: {
    verseId?: number;
    translator?: string;
    languageCode?: string;
  }) => void;
  dropdownOptions: {
    verses: VerseDropdown[];
    translators: string[];
    languages: string[];
  };
  initialFilter?: {
    verseId?: number;
    translator?: string;
    languageCode?: string;
  };
}

export const TranslationFilter: React.FC<TranslationFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  dropdownOptions,
  initialFilter,
}) => {
  const [verseId, setVerseId] = useState<string>(
    initialFilter?.verseId?.toString() || ''
  );
  const [translator, setTranslator] = useState<string>(
    initialFilter?.translator || ''
  );
  const [languageCode, setLanguageCode] = useState<string>(
    initialFilter?.languageCode || ''
  );

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      verseId: verseId ? Number(verseId) : undefined,
      translator: translator || undefined,
      languageCode: languageCode || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setVerseId('');
    setTranslator('');
    setLanguageCode('');
    onApply({
      verseId: undefined,
      translator: undefined,
      languageCode: undefined,
    });
    onClose();
  };

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
    >
      <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3
            className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
            id="modal-title"
          >
            Filter Translations
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Verse Reference */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              htmlFor="filter-verse"
            >
              Verse Reference
            </label>
            <div className="relative">
              <select
                id="filter-verse"
                value={verseId}
                onChange={(e) => setVerseId(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block appearance-none"
              >
                <option value="">Select a verse...</option>
                {dropdownOptions?.verses?.map((verse) => (
                  <option key={verse.id} value={verse.id}>
                    ({verse.id}) {verse.arabicText?.substring(0, 30) || ''}...
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDownIcon size={20} />
              </div>
            </div>
          </div>

          {/* Translator Name */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              htmlFor="filter-translator"
            >
              Translator Name
            </label>
            <div className="relative">
              <select
                id="filter-translator"
                value={translator}
                onChange={(e) => setTranslator(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block appearance-none"
              >
                <option value="">Select a translator...</option>
                {dropdownOptions?.translators?.map((translatorName) => (
                  <option key={translatorName} value={translatorName}>
                    {translatorName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDownIcon size={20} />
              </div>
            </div>
          </div>

          {/* Language Code */}
          <div className="space-y-1.5">
            <label
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              htmlFor="filter-language"
            >
              Language Code
            </label>
            <div className="relative">
              <select
                id="filter-language"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block appearance-none"
              >
                <option value="">Select language...</option>
                {dropdownOptions?.languages?.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDownIcon size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-slate-200 transition-all"
          >
            Reset Filter
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-primary/40 shadow-lg shadow-primary/20 transition-all"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
};
