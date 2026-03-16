import type { RoleCategory } from "@/lib/jobQueryEngine";

export type AtsBundleId = "startup" | "modern" | "enterprise";

export type AtsBundle = {
  id: AtsBundleId;
  label: string;
  description: string;
  domains: string[];
  recommendedRoleCategories?: RoleCategory[];
};

export const atsBundles: AtsBundle[] = [
  {
    id: "startup",
    label: "Startup ATS Jobs",
    description: "Companies using Greenhouse, Lever, or Ashby.",
    domains: ["boards.greenhouse.io", "job-boards.greenhouse.io", "jobs.lever.co", "jobs.ashbyhq.com"],
    recommendedRoleCategories: ["tech", "business", "data_analytics", "marketing_growth", "operations_strategy"],
  },
  {
    id: "modern",
    label: "Modern ATS Jobs",
    description: "Workable, Recruitee, BambooHR and similar.",
    domains: ["jobs.workable.com", "apply.workable.com", "jobs.recruitee.com", "jobs.bamboohr.com"],
    recommendedRoleCategories: ["tech", "business", "marketing_growth", "operations_strategy"],
  },
  {
    id: "enterprise",
    label: "Enterprise ATS Jobs",
    description: "Large companies using Workday, iCIMS, or SmartRecruiters.",
    domains: ["myworkdayjobs.com", "jobs.icims.com", "jobs.jobvite.com", "jobs.smartrecruiters.com"],
    recommendedRoleCategories: ["tech", "business", "legal_compliance", "data_analytics", "operations_strategy"],
  },
];

