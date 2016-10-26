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
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalizedStrings = (function () {
  _createClass(LocalizedStrings, [{
    key: "_getBestMatchingLanguage",
    value: function _getBestMatchingLanguage(language, props) {
      //If an object with the passed language key exists return it
      if (props[language]) return language;
      //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
      var idx = language.indexOf("-");
      if (idx >= 0) {
        language = language.substring(0, idx);
        if (props[language]) return language;
      }
      //Return the default language (the first coded)
      return Object.keys(props)[0];
    }
  }]);

  function LocalizedStrings(props) {
    _classCallCheck(this, LocalizedStrings);

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
  //indipendently from the interface one

  _createClass(LocalizedStrings, [{
    key: "setLanguage",
    value: function setLanguage(language) {
      //Check if exists a translation for the current language or if the default
      //should be used
      var bestLanguage = this._getBestMatchingLanguage(language, this.props);
      this.language = bestLanguage;
      //Associate the language object to the this object
      if (this.props[bestLanguage]) {
        //console.log("There are strings for the language:"+language);
        var localizedStrings = this.props[this.language];
        for (var key in localizedStrings) {
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
  }, {
    key: "getLanguage",
    value: function getLanguage() {
      return this.language;
    }

    //The current interface language (could differ from the language displayed)
  }, {
    key: "getInterfaceLanguage",
    value: function getInterfaceLanguage() {
      return interfaceLanguage;
    }

    //Return an array containing the available languages passed as props in the constructor
  }, {
    key: "getAvailableLanguages",
    value: function getAvailableLanguages() {
      if (!this.availableLanguages) {
        this.availableLanguages = [];
        for (var language in this.props) {
          this.availableLanguages.push(language);
        }
      }
      return this.availableLanguages;
    }

    //Format the passed string replacing the numbered placeholders
    //i.e. I'd like some {0} and {1}, or just {0}
    //Use example:
    //  strings.formatString(strings.question, strings.bread, strings.butter)
  }, {
    key: "formatString",
    value: function formatString(str) {
      var res = str;

      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < values.length; i++) {
        res = this._replaceAll("{" + i + "}", values[i], res);
      }
      return res;
    }

    //Replace all occorrencies of a string in another using RegExp
  }, {
    key: "_replaceAll",
    value: function _replaceAll(find, replace, str) {
      //Escape find
      find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      return str.replace(new RegExp(find, 'g'), replace);
    }
  }]);

  return LocalizedStrings;
})();

exports["default"] = LocalizedStrings;
module.exports = exports["default"];
