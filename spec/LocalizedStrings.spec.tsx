import React from 'react';
import LocalizedStrings from 'react-localization';
import { beforeEach, describe, expect, it } from 'vitest';


// Define types for the string configurations
interface StringConfig {
  language: string;
  how: string;
  boiledEgg: string;
  softBoiledEgg: string;
  choice: string;
  formattedValue: string;
  ratings: {
    excellent: string;
    good: string;
    missingComplex?: string;
  };
  missing?: string;
  currentDate: string;
  falsy: string;
}

interface StringsContent {
  en: StringConfig;
  it: StringConfig;
}

describe('Main Library Functions', () => {
  // Mock global navigator
  global.navigator = {} as Navigator;
  let strings: LocalizedStrings<StringConfig>;

  beforeEach(() => {
    strings = new LocalizedStrings<StringConfig>({
      en: {
        language: "english",
        how: "How do you want your egg today?",
        boiledEgg: "Boiled egg",
        softBoiledEgg: "Soft-boiled egg",
        choice: "How to choose the egg",
        formattedValue: "I'd like some {0} and {1}, or just {0}",
        ratings: {
          excellent: "excellent",
          good: "good",
          missingComplex: "missing value"
        },
        missing: "missing value",
        currentDate: "The current date is {month} {day}, {year}!",
        falsy: "{0} {1} {2} {3} {4} {5}"
      },
      it: {
        language: "italian",
        how: "Come vuoi il tuo uovo oggi?",
        boiledEgg: "Uovo sodo",
        softBoiledEgg: "Uovo alla coque",
        choice: "Come scegliere l'uovo",
        ratings: {
          excellent: "eccellente",
          good: "buono"
        },
        formattedValue: "Vorrei un po' di {0} e {1}, o solo {0}",
        currentDate: "La data corrente è {month} {day}, {year}!",
        falsy: "{0} {1} {2} {3} {4} {5}"
      }
    });
  });

  it("should set default language to en", () => {
    expect(strings.getLanguage()).toBe("en");
  });

  it("should list available languages", () => {
    expect(strings.getAvailableLanguages()).toEqual(["en", "it"]);
  });

  // Default language tests
  it('should extract simple value from default language', () => {
    expect(strings.how).toBe('How do you want your egg today?');
  });

  it('should extract complex value from default language', () => {
    expect(strings.ratings.good).toBe('good');
  });

  it('should get complex missing key from default language', () => {
    expect(strings.ratings.missingComplex).toBe('missing value');
  });

  it('should get missing key from default language', () => {
    expect((strings.ratings as any).notfound).toBeUndefined();
  });

  it('should format string in default language', () => {
    expect(strings.formatString(strings.formattedValue, "cake", "ice-cream"))
      .toBe("I'd like some cake and ice-cream, or just cake");
  });

  // Language switching tests
  it("should switch language to italian", () => {
    strings.setLanguage("it");
    expect(strings.getLanguage()).toBe("it");
  });

  it('should extract simple value from other language', () => {
    strings.setLanguage("it");
    expect(strings.how).toBe('Come vuoi il tuo uovo oggi?');
  });

  it('should extract complex value from other language', () => {
    strings.setLanguage("it");
    expect(strings.ratings.good).toBe('buono');
  });

  it('should get missing key from other language', () => {
    strings.setLanguage("it");
    expect(strings.missing).toBe('missing value');
  });

  it('should get complex missing key from other language', () => {
    strings.setLanguage("it");
    expect(strings.ratings.missingComplex).toBe('missing value');
  });

  it('should format string in other language', () => {
    strings.setLanguage("it");
    expect(strings.formatString(strings.formattedValue, "torta", "gelato"))
      .toBe("Vorrei un po' di torta e gelato, o solo torta");
  });

  it('should get string in a different language', () => {
    strings.setLanguage("it");
    expect(strings.getString("choice", "en")).toBe("How to choose the egg");
  });

  // Content switching tests
  interface NewContent {
    hello: string;
  }

  it('should switch to different props', () => {
    strings.setContent({
      fr: {
        hello: "bonjour"
      } as unknown as StringConfig,
      en: {
        hello: "hello"
      } as unknown as StringConfig,
      it: {
        hello: "ciao"
      } as unknown as StringConfig
    });
    strings.setLanguage("fr");
    expect((strings as any).hello).toBe('bonjour');
  });

  // React component tests
  describe('formatString with React components', () => {
    interface ReactStringConfig {
      onlyForMembers: string;
      onlyForMembersStrong: string;
      helloThere: string;
      boldText: string;
    }

    let reactStrings: LocalizedStrings<ReactStringConfig>;

    beforeEach(() => {
      reactStrings = new LocalizedStrings<ReactStringConfig>({
        en: {
          onlyForMembers: "Only who have {0} can enter",
          onlyForMembersStrong: "Only who have {0} can {1}",
          helloThere: "Hello {0}! Are you sure {0} is your name?",
          boldText: "Some {bold} text"
        },
        fi: {
          onlyForMembers: "Vain {0} voivat tulla",
          onlyForMembersStrong: "Vain {0} voivat {1}",
          helloThere: "Moi {0}! Onko {0} varmasti nimesi?",
          boldText: "Some {bold} text"
        }
      });
    });

    it('should handle one React component', () => {
      expect(reactStrings.formatString(reactStrings.onlyForMembers, <a href="#" > logged in </a>))
        .toEqual(["Only who have ", [<a href="#" key = "1" > logged in </a>], " can enter"]);
    });

    //Only who have {0} can {1}
    it('should handle two React components', () => {
      expect(reactStrings.formatString(reactStrings.onlyForMembersStrong, <a href="#"> logged in </a>, <b>enter</b>))
        .toEqual(["Only who have ", [<a href="#" key = "1"> logged in </a>], " can ", [<b key="3">enter</b>]]);
    });

    //helloThere: "Hello {0}! Are you sure {0} is your name?",
    it('should handle one React component twice in a string', () => {
      expect(reactStrings.formatString(reactStrings.helloThere, <i> Henrik </i>))
        .toEqual(["Hello ", [<i key="1"> Henrik </i>], "! Are you sure ", [<i key="3"> Henrik </i>], " is your name?"]);
    });

    it('should handle named tokens with components', () => {
      expect(reactStrings.formatString(reactStrings.boldText, {
        bold: <span className="bold"> BOLD </span>
      })).toEqual(["Some ", [<span key="1" className = "bold" > BOLD </span>], " text"]);
    });
  });
});