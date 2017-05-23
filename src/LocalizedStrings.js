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

const DEFAULT_VALUE = 'en-US';

export default class LocalizedStrings {
    _getInterfaceLanguage() {
        let lang = null;
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


    _getBestMatchingLanguage(language, props) {
        //If an object with the passed language key exists return it
        if (props[language]) return language;

        //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
        const idx = language.indexOf('-');
        const auxLang = (idx >= 0) ? language.substring(0, idx) : language;
        return props[auxLang] ? auxLang : Object.keys(props)[0];
    }


    constructor(props) {
        //Add property before checking for use of reserved words...
        this._interfaceLanguage = this._getInterfaceLanguage();
        this._language = this._interfaceLanguage;
        this.setContent(props);
    }

    setContent(props){
        this._defaultLanguage = Object.keys(props)[0];
        this._defaultLanguageFirstLevelKeys = [];
        //Store locally the passed strings
        this._props = props;
        //Check for use of reserved words
        this._validateProps(props[this._defaultLanguage]);
        //Store first level keys (for identifying missing translations)
        for (var key in this._props[this._defaultLanguage]) {
                if (typeof this._props[this._defaultLanguage][key]=="string") {
                    this._defaultLanguageFirstLevelKeys.push(key);
                }
            }
        //Set language to its default value (the interface)
        this.setLanguage(this._interfaceLanguage);
    }

    _validateProps(props) {
        Object.keys(props).map(key => {
            if (this.hasOwnProperty(key)) throw new Error(`${key} cannot be used as a key. It is a reserved word.`)
        })
    }


    //Can be used from ouside the class to force a particular language
    //indipendently from the interface one
    setLanguage(language) {
        //Check if exists a translation for the current language or if the default
        //should be used
        var bestLanguage = this._getBestMatchingLanguage(language, this._props);
        var defaultLanguage = Object.keys(this._props)[0];
        this._language = bestLanguage;
        //Associate the language object to the this object
        if (this._props[bestLanguage]) {
            //delete default propery values to identify missing translations
            for (key of this._defaultLanguageFirstLevelKeys){
                delete this[key];
            }
            var localizedStrings = Object.assign({}, this._props[this._language]);
            for (var key in localizedStrings) {
                if (localizedStrings.hasOwnProperty(key)) {
                    this[key] = localizedStrings[key];
                }
            }
            //Now add any string missing from the translation but existing in the default language
            if (defaultLanguage !== this._language) {
                localizedStrings = this._props[defaultLanguage];
                this._fallbackValues(localizedStrings, this);
            }
        }
    }

    //Load fallback values for missing translations 
    _fallbackValues(defaultStrings, strings) {
        for (var key in defaultStrings) {
            if (defaultStrings.hasOwnProperty(key) && !strings[key]) {
                strings[key] = defaultStrings[key];
                console.log(`🚧 👷 key '${key}' not found in localizedStrings for language ${this._language} 🚧`);
            } else {
                if (typeof strings[key] != "string") {
                    //It's an object
                    this._fallbackValues(defaultStrings[key], strings[key]);
                }
            }
        }
    }


    //The current language displayed (could differ from the interface language
    // if it has been forced manually and a matching translation has been found)
    getLanguage() {
        return this._language;
    }

    //The current interface language (could differ from the language displayed)
    getInterfaceLanguage() {
        return this._interfaceLanguage;
    }

    //Return an array containing the available languages passed as props in the constructor
    getAvailableLanguages() {
        if (!this._availableLanguages) {
            this._availableLanguages = [];
            for (let language in this._props) {
                this._availableLanguages.push(language);
            }
        }
        return this._availableLanguages;
    }

    //Format the passed string replacing the numbered placeholders
    //i.e. I'd like some {0} and {1}, or just {0}
    //Use example:
    //  strings.formatString(strings.question, strings.bread, strings.butter)
    formatString(str, ...values) {
        var res = str;
        for (let i = 0; i < values.length; i++) {
            res = this._replaceAll("{" + i + "}", values[i], res);
        }
        return res;
    }

    //Return a string with the passed key in a different language 
    getString(key, language) {
        try {
            return this._props[language][key];
        } catch (ex) {
            console.log("No localization found for key " + key + " and language " + language);
        }
        return null;
    }

    //Replace all occurrences of a string in another using RegExp
    _replaceAll(find, replace, str) {
        //Escape find
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }
}