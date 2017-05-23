import LocalizedStrings from './../src/LocalizedStrings';
let  strings = new LocalizedStrings({
 en:{
   language:"english",
   how:"How do you want your egg today?",
   boiledEgg:"Boiled egg",
   softBoiledEgg:"Soft-boiled egg",
   choice:"How to choose the egg",
   formattedValue:"I'd like some {0} and {1}, or just {0}",
   ratings:{
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
    ratings:{
     excellent:"eccellente",
     good:"buono"
   },
   formattedValue:"Vorrei un po' di {0} e {1}, o solo {0}",
 }
});

const secondarySet = {
  fr:{
    "hello":"bonjour"
  },
  en:{
    "hello":"hello"
  },
  it:{
    "hello":"ciao"
  }


}

describe('Main Library Functions', function () {

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
  it('Format string in default languate', function () {
    expect(strings.formatString(strings.formattedValue, "cake", "ice-cream")).toBe("I'd like some cake and ice-cream, or just cake");
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
    expect(strings.formatString(strings.formattedValue, "torta", "gelato")).toBe("Vorrei un po' di torta e gelato, o solo torta");
  });

  it('Get string in a different language', function () {
    expect(strings.getString("choice", "en")).toBe("How to choose the egg");
  });

  it('Switch to different props', function () {
    strings.setContent(
      secondarySet
    )
    strings.setLanguage("fr");
    expect(strings.hello).toEqual('bonjour');
  });

});