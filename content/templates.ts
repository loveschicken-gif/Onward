export type TemplateMeta = {
  label: string;
  description: string;
};

export const proTemplateMetaByLabel: Record<string, TemplateMeta> = {
  "Startup Jobs": {
    label: "Startup Jobs",
    description:
      "Queries focused on startup-friendly ATS systems such as Greenhouse, Lever, and Ashby to surface product-led companies.",
  },
  "Remote Jobs": {
    label: "Remote Jobs",
    description:
      "Patterns for finding remote-friendly roles across ATS platforms using explicit \"remote\" signals.",
  },
  "Enterprise Jobs": {
    label: "Enterprise Jobs",
    description:
      "Searches targeting enterprise ATS platforms such as Workday, iCIMS, and SmartRecruiters.",
  },
  "In-House Legal Roles": {
    label: "In-House Legal Roles",
    description:
      "Templates tuned for in-house legal, privacy, and compliance roles that often live on company career pages.",
  },
  "Entry-Level Tech Roles": {
    label: "Entry-Level Tech Roles",
    description:
      "Entry-level-focused templates for early-career engineers and analysts, with exclusions for senior titles.",
  },
  "International Candidate Search": {
    label: "International Candidate Search",
    description:
      "Visa and sponsorship-aware templates to help international candidates find companies open to relocation and work authorization.",
  },
};

