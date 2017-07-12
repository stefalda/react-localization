import LocalizedStrings from './../src/LocalizedStrings';

describe('Main Library Functions', function () {
  global.navigator = {};
  let strings = new LocalizedStrings({
    en: {
      language:"english",
      how:"How do you want your egg today?",
      boiledEgg:"Boiled egg",
      softBoiledEgg:"Soft-boiled egg",
      choice:"How to choose the egg",
      formattedValue:"I'd like some {0} and {1}, or just {0}",
      ratings: {
        excellent:"excellent",
        good:"good",
        missingComplex:"missing value"
      },
      missing:"missing value"
    },
    it: {
      how:"Come vuoi il tuo uovo oggi?",
      boiledEgg:"Uovo sodo",
      softBoiledEgg:"Uovo alla coque",
      choice:"Come scegliere l'uovo",
      ratings: {
        excellent:"eccellente",
        good:"buono"
      },
      formattedValue:"Vorrei un po' di {0} e {1}, o solo {0}",
    }
  });

  it("Set default language to en", function(){
    expect(strings.getLanguage()).toEqual("en");
  });

  it("List available languages", function(){
    expect(strings.getAvailableLanguages()).toEqual(["en", "it"]);
  });

  //Default language
  it('Extract simple value from default language', function () {
    expect(strings.how).toEqual('How do you want your egg today?');
  });
  it('Extract complex value from default language', function () {
    expect(strings.ratings.good).toEqual('good');
  });
  it('Get complex missing key from default language', function () {
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });
  it('Get missing key from default language', function () {
    expect(strings.ratings.notfound).toBe(undefined);
  });
  it('Format string in default language', function () {
    expect(strings.formatString(strings.formattedValue, "cake", "ice-cream"))
      .toEqual(["I'd like some ", "cake", " and ", "ice-cream", ", or just ", "cake"]);
  });

  //Switch language
  it("Switch language to italian", function(){
    strings.setLanguage("it");
    expect(strings.getLanguage()).toEqual("it");
  });
  it('Extract simple value from  other language', function () {
    expect(strings.how).toEqual('Come vuoi il tuo uovo oggi?');
  });
  
  it('Extract complex value from other language', function () {
    expect(strings.ratings.good).toEqual('buono');
  });
  
  it('Get missing key from other language', function () {
    expect(strings.missing).toEqual('missing value');
  });

  it('Get complex missing key from other language', function () {
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });
  it('Format string in other language', function () {
    expect(strings.formatString(strings.formattedValue, "torta", "gelato"))
      .toEqual(["Vorrei un po' di ", "torta", " e ", "gelato", ", o solo ", "torta"]);
  });

  it('Get string in a different language', function () {
    expect(strings.getString("choice", "en")).toBe("How to choose the egg");
  });

  it('Switch to different props', function () {
    strings.setContent({
      fr: {
        "hello":"bonjour"
      },
      en: {
        "hello":"hello"
      },
      it: {
        "hello":"ciao"
      }
    });
    strings.setLanguage("fr");
    expect(strings.hello).toEqual('bonjour');
  });

  it('Switch to different props not working', function () {
    strings = new LocalizedStrings({
          en: {
            a: {
              b: { x: "foo", y: "bar" },
              c: { z: "baz" }
              }
          }
          });
    strings.setContent({
      en: {
        a: {
          b: { x: "a.b.x", y: "a.b.y" },
          c: { z: "a.c.z" }
        }
      }
    });
    strings.setLanguage("en");
    expect(strings.a.b.x).toEqual('a.b.x');
  });

  it('Should throw an exception if a reserved word is used', () => {
    expect(() => { 
      strings = new LocalizedStrings({
        en: {
          language: "language",
          _language: "language is forbidden"
        }
      });
    }).toThrow(new Error("_language cannot be used as a key. It is a reserved word."));
  });

  describe('getInterfaceLanguage', () => {
    it('returns default language if not set', () => {
      expect(strings._getInterfaceLanguage()).toBe('en-US');
    });

    it('returns language when found', () => {
      global.navigator = {language: 'fi'};
      expect(strings._getInterfaceLanguage()).toBe('fi');
    });

    it('returns first in languages if set', () => {
      global.navigator = {languages: ['it', 'fr']};
      expect(strings._getInterfaceLanguage()).toBe('it');
    });

    it('returns userLanguage if set', () => {
      global.navigator = {userLanguage: 'fi'};
      expect(strings._getInterfaceLanguage()).toBe('fi');
    });

    it('returns browserLanguage if set', () => {
      global.navigator = {browserLanguage: 'it'};
      expect(strings._getInterfaceLanguage()).toBe('it');
    });

    it('returns language when all properties are available', () => {
      global.navigator = {
        language: 'hu',
        languages: ['fr'],
        userLanguage: 'de',
        browserLanguage: 'it',
      };
      expect(strings._getInterfaceLanguage()).toBe('hu');
    });
  });
});