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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_VALUE = 'en-US';

var LocalizedStrings = function () {
    _createClass(LocalizedStrings, [{
        key: '_getInterfaceLanguage',
        value: function _getInterfaceLanguage() {
            var lang = null;
            if (typeof navigator !== 'undefined' && navigator.languages && typeof navigator.languages !== 'undefined' && navigator.languages[0] && typeof navigator.languages[0] !== 'undefined') {
                lang = navigator.languages[0];
            } else if (typeof navigator !== 'undefined' && navigator.language && typeof navigator.language !== 'undefined') {
                lang = navigator.language;
            } else if (typeof navigator !== 'undefined' && navigator.userLanguage && typeof navigator.userLanguage !== 'undefined') {
                lang = navigator.userLanguage;
            } else if (typeof navigator !== 'undefined' && navigator.browserLanguage && typeof navigator.browserLanguage !== 'undefined') {
                lang = navigator.browserLanguage;
            }
            return lang || DEFAULT_VALUE;
        }
    }, {
        key: '_getBestMatchingLanguage',
        value: function _getBestMatchingLanguage(language, props) {
            //If an object with the passed language key exists return it
            if (props[language]) return language;

            //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
            var idx = language.indexOf('-');
            var auxLang = idx >= 0 ? language.substring(0, idx) : language;
            return props[auxLang] ? auxLang : Object.keys(props)[0];
        }
    }]);

    function LocalizedStrings(props) {
        _classCallCheck(this, LocalizedStrings);

        this.interfaceLanguage = this._getInterfaceLanguage();
        this.language = this.interfaceLanguage;
        //Store locally the passed strings
        this.defaultLanguage = Object.keys(props)[0];
        this.props = props;
        this._validateProps(props[this.defaultLanguage]);
        this._createGettersForProps(this.props, this.defaultLanguage);
        //Set language to its default value (the interface)
        this.setLanguage(this.interfaceLanguage);
    }

    _createClass(LocalizedStrings, [{
        key: '_validateProps',
        value: function _validateProps(props) {
            var _this = this;

            Object.keys(props).map(function (key) {
                if (_this.hasOwnProperty(key)) throw new Error(key + ' cannot be used as a key. It is a reserved word.');
            });
        }
    }, {
        key: '_createGettersForProps',
        value: function _createGettersForProps(props, defaultLanguage) {
            var keys = Object.keys(props[defaultLanguage]);
            keys.map(this._createGetterForProp.bind(this));
        }
    }, {
        key: '_createGetterForProp',
        value: function _createGetterForProp(key) {
            var _this2 = this;

            Object.defineProperty(this, key, {
                get: function get() {
                    var string = _this2.getString(key, _this2.getLanguage());
                    if (string === null) {
                        // we have a chance here to throw an error or perhaps return something like:
                        // `🚧 👷 key ${key} not found in localizedStrings for language ${this.getLanguage()} 🚧`
                    }
                    return string;
                }
            });
        }

        //Can be used from ouside the class to force a particular language
        //independently from the interface one

    }, {
        key: 'setLanguage',
        value: function setLanguage(language) {
            //Check if a translation exists for the current language or if the default
            //should be used
            this.language = this._getBestMatchingLanguage(language, this.props);
        }

        //The current language displayed (could differ from the interface language
        // if it has been forced manually and a matching translation has been found)

    }, {
        key: 'getLanguage',
        value: function getLanguage() {
            return this.language;
        }

        //The current interface language (could differ from the language displayed)

    }, {
        key: 'getInterfaceLanguage',
        value: function getInterfaceLanguage() {
            return this.interfaceLanguage;
        }

        //Return an array containing the available languages passed as props in the constructor

    }, {
        key: 'getAvailableLanguages',
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
        key: 'formatString',
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

        //Return a string with the passed key in a different language

    }, {
        key: 'getString',
        value: function getString(key, language) {
            try {
                return this.props[language][key];
            } catch (ex) {
                console.log("No localization found for key " + key + " and language " + language);
            }
            return null;
        }

        //Replace all occurrences of a string in another using RegExp

    }, {
        key: '_replaceAll',
        value: function _replaceAll(find, replace, str) {
            //Escape find
            find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            return str.replace(new RegExp(find, 'g'), replace);
        }
    }]);

    return LocalizedStrings;
}();

exports.default = LocalizedStrings;
