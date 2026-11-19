import { enDictionary } from "./dictionaries/en";
import { faDictionary } from "./dictionaries/fa";
import { Dictionary, LanguageOption, SupportedLanguage, TextDirection } from "./types";

export * from "./types";

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", dir: "ltr", label: "English" },
  { code: "fa", dir: "rtl", label: "فارسی" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const DICTIONARIES: Record<SupportedLanguage, Dictionary> = {
  en: enDictionary,
  fa: faDictionary,
};

export function getDictionary(lang: SupportedLanguage): Dictionary {
  return DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANGUAGE];
}

export function getDirection(lang: SupportedLanguage): TextDirection {
  return lang === "fa" ? "rtl" : "ltr";
}
