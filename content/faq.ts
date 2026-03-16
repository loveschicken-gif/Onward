export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Why do some searches return few results?",
    answer:
      "Career pages can be picky about job titles and locations. If results look thin, try a broader title or loosen a location filter.",
  },
  {
    question: "Why does Onvard search company career pages instead of job boards?",
    answer:
      "Many roles first appear on ATS platforms such as Greenhouse, Lever, and Workday. Searching those sites and company career pages helps you reach openings before they show up on big job boards.",
  },
  {
    question: "Can I search jobs outside the United States?",
    answer:
      "Yes. Onvard works worldwide. Add a city or country (for example, London, Berlin, Singapore) to focus your search.",
  },
  {
    question: "Does Onvard collect my data?",
    answer:
      "No. There are no accounts or personal profiles. We only track simple anonymous usage counts.",
  },
  {
    question: "Does Onvard support other languages?",
    answer:
      "Yes. You can search in English or your local language. English job titles often surface more global career pages, so it can help to try both.",
  },
  {
    question: "Does Onvard tell me whether I qualify for a visa or a job?",
    answer:
      "No. Onvard helps you search, but it does not determine visa eligibility, licensing, or whether a company will sponsor you. For those questions, you will need official guidance.",
  },
];

