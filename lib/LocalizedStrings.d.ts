declare module 'react-localization' {
    type Formatted = number | string | JSX.Element;
    type FormatObject<U extends Formatted> = { [key: string]: U };
    
    export interface GlobalStrings<T> {		
      [language: string]: T;		
    }
    
  
    interface LocalizedStringsMethods {
        setLanguage(language: string): void;
        getLanguage(): string;
        getInterfaceLanguage(): string;
        formatString<T extends Formatted>(str: string, ...values: Array<T | FormatObject<T>>): Array<string | T>;
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
