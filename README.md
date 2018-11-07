# react-localization
Simple module to localize the React interface using the same syntax used in the
[ReactNativeLocalization module](https://github.com/stefalda/ReactNativeLocalization/).

### Note about version 1.x
 This library has been refactored to use the newly created [localized-strings package](https://github.com/stefalda/localized-strings), now added as a dependency, so to unify the code and make it easier to mantain

 All the basic code is now in the localized-strings project but this React version add support for embedding JSX code in the formatted strings, by overriding the formatString method.

## How it works

The library uses the current interface language, then it loads and displays the strings matching the current interface locale or the default language (the first one if a match is not found) if a specific localization can't be found.

It's possible to force a language different from the interface one.

##Installation

`npm install --save react-localization`

## Usage

In the React class that you want to localize require the library and define the strings object passing to the constructor a simple object containing a language key (i.e. en, it, fr..) and then a list of key-value pairs with the needed localized strings.

 ```js
// ES6 module syntax
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en:{
    how:"How do you want your egg today?",
    boiledEgg:"Boiled egg",
    softBoiledEgg:"Soft-boiled egg",
    choice:"How to choose the egg"
  },
  it: {
    how:"Come vuoi il tuo uovo oggi?",
    boiledEgg:"Uovo sodo",
    softBoiledEgg:"Uovo alla coque",
    choice:"Come scegliere l'uovo"
  }
});
```

Then use the `strings` object literal directly in the render method accessing the key of the localized string.

```js
<Text style={styles.title}>
  {strings.how}
</Text>
```

The first language is considered the default one, so if a translation is missing for the selected language, the default one is shown and a line is written to the log as a reminder.

#### Update / Overwrite Locale

You might have default localized in the build but then download the latest localization strings from a server. Use setContent to overwrite the whole object. 

**NOTE** that this will remove all other localizations if used.

```js
strings.setContent({
  en:{
    how:"How do you want your egg todajsie?",
    boiledEgg:"Boiled eggsie",
    softBoiledEgg:"Soft-boiled egg",
    choice:"How to choose the egg"
  }
})
```

## API

* setLanguage(languageCode) - to force manually a particular language
* getLanguage() - to get the current displayed language
* getInterfaceLanguage() - to get the current device interface language
* formatString() - to format the passed string replacing its placeholders with the other arguments strings
```js
  en:{
    bread:"bread",
    butter:"butter",
    question:"I'd like {0} and {1}, or just {0}"
    ...
    login: 'login',
    onlyForMembers: 'You have to {0} in order to use our app',
    bold: 'bold',
    iAmText: 'I am {0} text',
    ...
    january: 'January',
    currentDate: 'The current date is {month} {day}, {year}!'
  }
  ...
  strings.formatString(strings.question, strings.bread, strings.butter)

  // React components can be used as placeholder values! Useful when using links or customizing style
  strings.formatString(strings.onlyForMembers, <a href="http://login.com">{strings.login}</a>)
  strings.formatString(strings.iAmText, <b>{strings.bold}</b>)

  // Named tokens can also be used to give some extra context to the format strings
  // You cannot mix tokens, something like formatString('{0}, {name}', 'Hello', {name: 'Bob'}) won't work
  strings.formatString(strings.currentDate, {
    month: strings.january,
    day: 12,
    year: 2018
  })
```
**Beware: do not define a string key as formatString!**

* setContent(props) - to dynamically load another set of strings
* getAvailableLanguages() - to get an array of the languages passed in the constructor

## Examples
To force a particular language use something like this:

```js
_onSetLanguageToItalian() {
  strings.setLanguage('it');
  this.setState({});
}
```
## Typescript support
Because of the dynamically generated class properties, it's a little tricky to have the autocomplete functionality working.

Anyway it's possible to gain the desired results by:
1. defining an Interface that extends the LocalizedStringsMethods interface and has all the object string's keys
2. defining that the LocalizedStrings instance implements that interface 

This is the suggested solution to work with Typescript:

```js
export interface IStrings extends LocalizedStringsMethods{
    score:string;
    time: String;
}

public strings: IStrings;
this.strings = new LocalizedStrings({
            it: {
                score: "Punti",
                time: "Tempo"
            },
            en: {
                score: "Score",
                time: "Time"
            }
        });

```
## Questions or suggestions?
Feel free to contact me on [Twitter](https://twitter.com/talpaz) or [open an issue](https://github.com/stefalda/react-localization/issues/new).
