export function getInterfaceLanguage() {
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

export function validateProps(props) {
  const reservedNames = [
    '_interfaceLanguage',
    '_language',
    '_defaultLanguage',
    '_defaultLanguageFirstLevelKeys',
    '_props',
  ];
  Object.keys(props).map(key => {
    if (reservedNames.indexOf(key)>=0) throw new Error(`${key} cannot be used as a key. It is a reserved word.`)
  });
}