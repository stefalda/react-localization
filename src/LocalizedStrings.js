'use strict';
/**
 * Simple module to localize the React interface using the same syntax
 * used in the ReactNativeLocalization module
 * (https://github.com/stefalda/ReactNativeLocalization)
 *
 * Originally developed by Stefano Falda (stefano.falda@gmail.com)
 *
 * It uses a call to the Navigator/Browser object to get the current interface language,
 * then display the correct language strings or the default language (the first
 * one if a match is not found).
 *
 * How to use:
 * Check the instructions at:
 * https://github.com/stefalda/react-localization
 */
export default class LocalizedStrings{

  _getBestMatchingLanguage(language, props){
    //If an object with the passed language key exists return it
    if (props[language]) return language;
    //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
    var idx = language.indexOf("-");
    if (idx>=0) {
      language = language.substring(0,idx);
      if (props[language]) return language;
    }
    //Return the default language (the first coded)
    return Object.keys(props)[0];
  }


  constructor(props) {
    var interfaceLanguage = (typeof navigator !== 'undefined' && navigator.languages && typeof navigator.languages !== 'undefined' && navigator.languages[0] && typeof navigator.languages[0] !== 'undefined') ? navigator.languages[0] :
        ((typeof navigator !== 'undefined' && navigator.language && typeof navigator.language !== 'undefined') ? navigator.language :
            ((typeof navigator !== 'undefined' && navigator.userLanguage && typeof navigator.userLanguage !== 'undefined') ? navigator.userLanguage :
                'en-US'));
    //Store locally the passed strings
    this.props = props;
    //Set language to its default value (the interface)
    this.setLanguage(interfaceLanguage);
  }

  //Can be used from ouside the class to force a particular language
  //independently from the interface one
  setLanguage(language){
        //Check if a translation exists for the current language or if the default
        //should be used
        var bestLanguage = this._getBestMatchingLanguage(language, this.props);
        this.language = bestLanguage;
        //Associate the language object to the this object
        if (this.props[bestLanguage]){
          //console.log("There are strings for the language:"+language);
          var localizedStrings = Object.assign(this.props[Object.keys(this.props)[0]], this.props[this.language]);
          for (var key in localizedStrings){
            //console.log("Checking property:"+key);
            if (localizedStrings.hasOwnProperty(key)) {
              //console.log("Associating property:"+key);
              this[key] = localizedStrings[key];
            }
          }
        }
    }

  //The current language displayed (could differ from the interface language
  // if it has been forced manually and a matching translation has been found)
  getLanguage(){
    return this.language;
  }

  //The current interface language (could differ from the language displayed)
  getInterfaceLanguage(){
    return interfaceLanguage;
  }

  //Return an array containing the available languages passed as props in the constructor
  getAvailableLanguages(){
    if (!this.availableLanguages){
      this.availableLanguages = [];
      for(let language in this.props){
         this.availableLanguages.push(language);
      }
    }
    return this.availableLanguages;
  }

  //Format the passed string replacing the numbered placeholders
  //i.e. I'd like some {0} and {1}, or just {0}
  //Use example:
  //  strings.formatString(strings.question, strings.bread, strings.butter)
  formatString(str, ...values){
      var res = str;
      for (let i=0; i<values.length;i++){
          res = this._replaceAll("{"+i+"}", values[i], res);
      }
      return res;
  }

  //Replace all occorrencies of a string in another using RegExp
  _replaceAll(find, replace, str) {
    //Escape find
    find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(find, 'g'), replace);
  }
}
