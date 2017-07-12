'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInterfaceLanguage = getInterfaceLanguage;
function getInterfaceLanguage() {
    if (!!navigator && !!navigator.language) {
        return navigator.language;
    } else if (!!navigator && !!navigator.languages && !!navigator.languages[0]) {
        return navigator.languages[0];
    } else if (!!navigator && !!navigator.userLanguage) {
        return navigator.userLanguage;
    } else if (!!navigator && !!navigator.browserLanguage) {
        return navigator.browserLanguage;
    }
    return 'en-US';
}