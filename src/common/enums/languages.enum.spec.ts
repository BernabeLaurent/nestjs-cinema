import { Languages } from './languages.enum';

describe('Languages Enum', () => {
  it('should be defined', () => {
    expect(Languages).toBeDefined();
  });

  describe('Major languages', () => {
    it('should have ENGLISH value', () => {
      expect(Languages.ENGLISH).toBeDefined();
      expect(Languages.ENGLISH).toBe('en');
    });

    it('should have FRENCH value', () => {
      expect(Languages.FRENCH).toBeDefined();
      expect(Languages.FRENCH).toBe('fr');
    });

    it('should have SPANISH value', () => {
      expect(Languages.SPANISH).toBeDefined();
      expect(Languages.SPANISH).toBe('es');
    });

    it('should have CHINESE value', () => {
      expect(Languages.CHINESE).toBeDefined();
      expect(Languages.CHINESE).toBe('zh');
    });

    it('should have RUSSIAN value', () => {
      expect(Languages.RUSSIAN).toBeDefined();
      expect(Languages.RUSSIAN).toBe('ru');
    });
  });

  describe('ISO language codes', () => {
    it('should use ISO 639-1 codes', () => {
      expect(Languages.ENGLISH).toBe('en');
      expect(Languages.GERMAN).toBe('de');
      expect(Languages.ITALIAN).toBe('it');
      expect(Languages.JAPANESE).toBe('ja');
      expect(Languages.KOREAN).toBe('ko');
    });

    it('should support some ISO 639-2 codes for specific languages', () => {
      expect(Languages.FILIPINO).toBe('fil');
      expect(Languages.HAWAIIAN).toBe('haw');
    });
  });

  describe('Enum structure', () => {
    it('should contain all expected language keys', () => {
      const majorLanguageKeys = [
        'ENGLISH',
        'FRENCH',
        'SPANISH',
        'GERMAN',
        'ITALIAN',
      ];
      majorLanguageKeys.forEach((key) => {
        expect(Object.keys(Languages)).toContain(key);
      });
    });

    it('should have string values', () => {
      const languageValues = Object.values(Languages);
      languageValues.forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have UNKNOWN fallback', () => {
      expect(Languages.UNKNOWN).toBe('xx');
    });

    it('should have unique values', () => {
      const values = Object.values(Languages);
      const uniqueValues = [...new Set(values)];
      expect(values).toHaveLength(uniqueValues.length);
    });
  });

  describe('Language categories', () => {
    it('should include European languages', () => {
      expect(Languages.FRENCH).toBe('fr');
      expect(Languages.GERMAN).toBe('de');
      expect(Languages.ITALIAN).toBe('it');
      expect(Languages.DUTCH).toBe('nl');
      expect(Languages.PORTUGUESE).toBe('pt');
    });

    it('should include Asian languages', () => {
      expect(Languages.CHINESE).toBe('zh');
      expect(Languages.JAPANESE).toBe('ja');
      expect(Languages.KOREAN).toBe('ko');
      expect(Languages.THAI).toBe('th');
      expect(Languages.VIETNAMESE).toBe('vi');
    });

    it('should include Indian languages', () => {
      expect(Languages.HINDI).toBe('hi');
      expect(Languages.BENGALI).toBe('bn');
      expect(Languages.TAMIL).toBe('ta');
      expect(Languages.TELUGU).toBe('te');
      expect(Languages.MARATHI).toBe('mr');
    });

    it('should include constructed languages', () => {
      expect(Languages.ESPERANTO).toBe('eo');
      expect(Languages.INTERLINGUA).toBe('ia');
    });
  });

  describe('Utility functions', () => {
    it('should be usable in switch statements', () => {
      const getLanguageName = (lang: Languages) => {
        switch (lang) {
          case Languages.ENGLISH:
            return 'English';
          case Languages.FRENCH:
            return 'Français';
          case Languages.SPANISH:
            return 'Español';
          default:
            return 'Unknown';
        }
      };

      expect(getLanguageName(Languages.ENGLISH)).toBe('English');
      expect(getLanguageName(Languages.FRENCH)).toBe('Français');
      expect(getLanguageName(Languages.SPANISH)).toBe('Español');
    });

    it('should support language region checking', () => {
      const isEuropeanLanguage = (lang: Languages): boolean => {
        const europeanLangs: Languages[] = [
          Languages.ENGLISH,
          Languages.FRENCH,
          Languages.GERMAN,
          Languages.ITALIAN,
          Languages.SPANISH,
          Languages.PORTUGUESE,
          Languages.DUTCH,
          Languages.POLISH,
          Languages.SWEDISH,
        ];
        return europeanLangs.includes(lang);
      };

      expect(isEuropeanLanguage(Languages.ENGLISH)).toBe(true);
      expect(isEuropeanLanguage(Languages.FRENCH)).toBe(true);
      expect(isEuropeanLanguage(Languages.CHINESE)).toBe(false);
      expect(isEuropeanLanguage(Languages.JAPANESE)).toBe(false);
    });

    it('should support RTL language detection', () => {
      const isRTLLanguage = (lang: Languages): boolean => {
        const rtlLanguages: Languages[] = [
          Languages.ARABIC,
          Languages.HEBREW,
          Languages.PERSIAN,
          Languages.URDU,
        ];
        return rtlLanguages.includes(lang);
      };

      expect(isRTLLanguage(Languages.ARABIC)).toBe(true);
      expect(isRTLLanguage(Languages.HEBREW)).toBe(true);
      expect(isRTLLanguage(Languages.ENGLISH)).toBe(false);
      expect(isRTLLanguage(Languages.FRENCH)).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should be serializable to JSON', () => {
      expect(JSON.stringify(Languages.ENGLISH)).toBe('"en"');
      expect(JSON.stringify(Languages.FRENCH)).toBe('"fr"');
      expect(Languages.UNKNOWN).toBe('xx');
    });

    it('should work with arrays', () => {
      const supportedLanguages = [
        Languages.ENGLISH,
        Languages.FRENCH,
        Languages.SPANISH,
      ];
      expect(supportedLanguages).toHaveLength(3);
      expect(supportedLanguages).toContain('en');
      expect(supportedLanguages).toContain('fr');
      expect(supportedLanguages).toContain('es');
    });
  });

  describe('Comprehensive coverage', () => {
    it('should have a substantial number of languages', () => {
      const languageCount = Object.keys(Languages).length;
      expect(languageCount).toBeGreaterThan(100);
    });

    it('should include major world languages', () => {
      const majorLanguages = [
        Languages.ENGLISH,
        Languages.CHINESE,
        Languages.SPANISH,
        Languages.HINDI,
        Languages.ARABIC,
        Languages.PORTUGUESE,
        Languages.BENGALI,
        Languages.RUSSIAN,
        Languages.JAPANESE,
        Languages.GERMAN,
      ];

      majorLanguages.forEach((lang) => {
        expect(lang).toBeDefined();
        expect(typeof lang).toBe('string');
      });
    });

    it('should support language validation', () => {
      const isValidLanguageCode = (code: string): code is Languages => {
        return Object.values(Languages).includes(code as Languages);
      };

      expect(isValidLanguageCode('en')).toBe(true);
      expect(isValidLanguageCode('fr')).toBe(true);
      expect(isValidLanguageCode('invalid')).toBe(false);
      expect(isValidLanguageCode('')).toBe(false);
    });
  });
});
