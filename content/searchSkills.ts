import type { RoleCategory } from "@/lib/jobQueryEngine";

export type SearchSkill = {
  id: string;
  title: string;
  description: string;
  appliesTo: RoleCategory[];
  defaultModifiers?: string[];
  suggestedQueries: string[];
};

export const searchSkills: SearchSkill[] = [
  {
    id: "international-candidate-search",
    title: "International candidate search",
    description:
      "Use visa and sponsorship signals across startup, modern, and enterprise ATS platforms to uncover roles open to international candidates.",
    appliesTo: ["tech", "business", "data_analytics", "marketing_growth", "operations_strategy", "legal_compliance"],
    defaultModifiers: ["visa_sponsorship", "international"],
    suggestedQueries: [
      "software engineer visa sponsorship berlin",
      "data scientist visa sponsorship toronto",
      "privacy counsel relocation singapore",
    ],
  },
  {
    id: "startup-ats-search",
    title: "Startup ATS search",
    description:
      "Focus on Greenhouse, Lever, and Ashby-powered career pages to find roles at product-led startups before they hit the big job boards.",
    appliesTo: ["tech", "business", "data_analytics", "marketing_growth", "operations_strategy"],
    suggestedQueries: [
      "product manager london site:boards.greenhouse.io",
      "software engineer remote site:jobs.lever.co",
      "growth marketing manager berlin greenhouse OR lever",
    ],
  },
  {
    id: "remote-role-search",
    title: "Remote role search",
    description:
      "Use broader role titles and explicit \"remote\" signals to surface distributed-friendly roles across regions and time zones.",
    appliesTo: ["tech", "business", "data_analytics", "marketing_growth", "operations_strategy"],
    defaultModifiers: ["remote"],
    suggestedQueries: [
      "software engineer remote",
      "data analyst remote europe",
      "customer success manager remote",
    ],
  },
  {
    id: "legal-compliance-search",
    title: "In-house legal and compliance search",
    description:
      "Target in-house legal, privacy, and compliance roles that are more likely to live on company career pages than on generic job sites.",
    appliesTo: ["legal_compliance"],
    suggestedQueries: [
      "privacy counsel london careers",
      "in-house legal counsel berlin site:myworkdayjobs.com",
      "compliance manager fintech singapore careers",
    ],
  },
  {
    id: "discover-hiring-companies",
    title: "Discover hiring companies",
    description:
      "Use industry + location + careers patterns to find new companies and then drill into their ATS-powered career pages.",
    appliesTo: ["tech", "business", "data_analytics", "marketing_growth", "operations_strategy", "general"],
    suggestedQueries: [
      "AI companies berlin careers",
      "fintech companies singapore hiring",
      "SaaS companies toronto careers",
    ],
  },
  {
    id: "search-like-a-pro",
    title: "Search like a pro",
    description:
      "Prebuilt templates for startup, remote, enterprise, legal, entry-level, and international candidate searches using clean Google-ready queries.",
    appliesTo: ["tech", "business", "legal_compliance", "data_analytics", "marketing_growth", "operations_strategy"],
    suggestedQueries: [
      "software engineer london (inurl:careers OR inurl:jobs) -site:linkedin.com",
      "privacy counsel remote site:boards.greenhouse.io",
      "entry level data analyst toronto (inurl:careers OR inurl:jobs)",
    ],
  },
];

