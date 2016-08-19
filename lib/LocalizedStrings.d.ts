declare module "react-localization" {
    interface LocalizedStringsMethods {
        setLanguage(language: string): void;
        getLanguage(): string;
        getInterfaceLanguage(): string;
        formatString(str: string, ...values: any[]): string
        getAvailableLanguages(): string[]
    }

    interface LocalizedStringsFactory {
        new (props: any): LocalizedStringsMethods;
    }

    var LocalizedStrings: LocalizedStringsFactory;
    export = LocalizedStrings;
}