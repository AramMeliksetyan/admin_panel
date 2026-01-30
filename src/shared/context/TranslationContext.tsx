import * as React from "react";
import { TranslationContext } from "./useTranslation";

export type Translations = Record<string, string>;

export function TranslationProvider({
  children,
  initialTranslations = {},
}: {
  children: React.ReactNode;
  /** Initial translations (e.g. from backend); can be updated via setTranslations */
  initialTranslations?: Translations;
}) {
  const [translations, setTranslationsState] =
    React.useState<Translations>(initialTranslations);

  const setTranslations = React.useCallback((next: Translations) => {
    setTranslationsState((prev) => ({ ...prev, ...next }));
  }, []);

  const t = React.useCallback(
    (key: string, params?: Record<string, string>): string => {
      let value = translations[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(
            new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g"),
            v
          );
        });
      }
      return value;
    },
    [translations]
  );

  const value = React.useMemo(
    () => ({ translations, setTranslations, t }),
    [translations, setTranslations, t]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}
