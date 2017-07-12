import * as utils from '../src/utils';

describe('getInterfaceLanguage', () => {
  it('returns default language if not set', () => {
    global.navigator = {};
    expect(utils.getInterfaceLanguage()).toBe('en-US');
  });

  it('returns language when found', () => {
    global.navigator = {language: 'fi'};
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns first in languages if set', () => {
    global.navigator = {languages: ['it', 'fr']};
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns userLanguage if set', () => {
    global.navigator = {userLanguage: 'fi'};
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns browserLanguage if set', () => {
    global.navigator = {browserLanguage: 'it'};
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns language when all properties are available', () => {
    global.navigator = {
      language: 'hu',
      languages: ['fr'],
      userLanguage: 'de',
      browserLanguage: 'it',
    };
    expect(utils.getInterfaceLanguage()).toBe('hu');
  });
});