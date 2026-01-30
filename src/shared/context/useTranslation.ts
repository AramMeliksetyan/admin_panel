import * as React from "react";

export type TranslationContextValue = {
  translations: Record<string, string>;
  setTranslations: (translations: Record<string, string>) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

export const TranslationContext = React.createContext<
  TranslationContextValue | undefined
>(undefined);

export function useTranslation(): TranslationContextValue {
  const ctx = React.useContext(TranslationContext);
  if (ctx === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return ctx;
}

/** Safe version that returns key when used outside provider (e.g. in tests) */
export function useTranslationOptional(): TranslationContextValue | null {
  return React.useContext(TranslationContext) ?? null;
}
