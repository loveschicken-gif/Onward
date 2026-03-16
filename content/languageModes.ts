export type LanguageModeId = "auto" | "en" | "th";

export type LanguageModeConfig = {
  id: LanguageModeId;
  label: string;
  description: string;
};

export const languageModes: LanguageModeConfig[] = [
  {
    id: "auto",
    label: "Auto",
    description:
      "Let Onvard infer language from your query. English and Thai aliases are both supported.",
  },
  {
    id: "en",
    label: "English",
    description:
      "Focus on English role titles and locations. Best for most global and multinational company career pages.",
  },
  {
    id: "th",
    label: "Thai",
    description:
      "Emphasize Thai role and location aliases while still using English where helpful for international searches.",
  },
];

