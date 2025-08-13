declare module 'translit-rus-eng' {
  interface TranslitOptions {
      /**
       * Forced target language choice
       * Possible values: "rus" (Russian) or "eng" (English)
       */
      target?: 'rus' | 'eng';
      
      /**
       * When true, converts the output to a URL-friendly slug-like string
       * (e.g., replaces spaces with underscores, removes special characters, etc.)
       */
      slugify?: boolean;
  }

  /**
   * Transliterates text between Russian and English
   * @param string String value to transliterate (Russian or English, auto-selects language unless target is specified)
   * @param options Optional settings for transliteration
   * @returns The transliterated string
   */
  function translitRusEng(string: string, options?: TranslitOptions): string;

  export = translitRusEng;
}
