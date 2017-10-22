declare module 'react-localization' {
    export interface GlobalStrings<T> {		
      [language: string]: T;		
    }
  
    interface LocalizedStringsMethods {
        setLanguage(language: string): void;
        getLanguage(): string;
        getInterfaceLanguage(): string;
        formatString(str: string, ...values: any[]): string;
        getAvailableLanguages(): string[];
        getString(key: string, language: string): string;
        setContent(props: any): void;
    }
  
    interface LocalizedStringsFactory {
        new <T>(props: GlobalStrings<T>): LocalizedStringsMethods & T;
    }
  
    var LocalizedStrings: LocalizedStringsFactory;
    export default LocalizedStrings;
  }