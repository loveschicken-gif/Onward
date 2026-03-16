export type SearchTip = {
  id: string;
  title: string;
  example: string;
};

export const searchTips: SearchTip[] = [
  {
    id: "broader-titles",
    title: "Try one broader title",
    example: "AI policy strategist → policy analyst",
  },
  {
    id: "adjust-location",
    title: "Widen your location once",
    example: "privacy counsel dubai → privacy counsel remote",
  },
  {
    id: "related-roles",
    title: "Add one related role",
    example: "software engineer → backend engineer, full stack engineer",
  },
];

export const searchTipsNote =
  "Works worldwide. English titles often surface the most global career pages.";

