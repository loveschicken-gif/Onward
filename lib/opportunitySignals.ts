import type { RoleCategory } from "@/lib/jobQueryEngine";

export type OpportunitySignal = {
  id: string;
  title: string;
  description: string;
  confidence: "low" | "medium" | "high";
  category: "demand" | "strategy" | "international" | "search";
};

/** Minimal plan shape used to generate signals (avoids circular dependency). */
export type PlanForSignals = {
  roleCategory: RoleCategory;
  modifiers: string[];
  expandedJobTitles: string[];
  companyDiscoveryQueries: string[];
};

function hasVisaOrInternational(modifiers: string[]): boolean {
  return (
    modifiers.includes("visa_sponsorship") || modifiers.includes("international")
  );
}

function hasRemote(modifiers: string[]): boolean {
  return modifiers.includes("remote");
}

/**
 * Generate opportunity signals from the search plan. Signals are derived only from
 * parsed query, generated searches, role dictionaries, and simple heuristics.
 * No external APIs or user data.
 */
export function generateOpportunitySignals(
  plan: PlanForSignals
): OpportunitySignal[] {
  const signals: OpportunitySignal[] = [];
  const { roleCategory, modifiers, expandedJobTitles, companyDiscoveryQueries } =
    plan;

  // 1. Role demand – tech / data_analytics
  if (roleCategory === "tech" || roleCategory === "data_analytics") {
    signals.push({
      id: "demand-tech",
      title: "High demand role category",
      description:
        "Engineering and data roles are widely posted across startup and enterprise career pages. Expanding searches across multiple ATS platforms can increase coverage.",
      confidence: "high",
      category: "demand",
    });
  }

  // 2. Business role
  if (roleCategory === "business" || roleCategory === "operations_strategy") {
    signals.push({
      id: "demand-business",
      title: "Business roles appear under multiple titles",
      description:
        "Roles such as operations, strategy, and partnerships often appear under slightly different titles. Trying expanded searches or similar roles can uncover additional opportunities.",
      confidence: "medium",
      category: "demand",
    });
  }

  // 3. Legal role
  if (roleCategory === "legal_compliance") {
    signals.push({
      id: "strategy-legal",
      title: "In-house legal roles are often embedded in company career pages",
      description:
        "Legal and compliance roles are frequently posted directly on company career pages rather than aggregated job boards. Searching ATS systems and career pages may reveal additional listings.",
      confidence: "medium",
      category: "strategy",
    });
  }

  // 4. International
  if (hasVisaOrInternational(modifiers)) {
    signals.push({
      id: "international-visa",
      title: "International hiring signals detected",
      description:
        "Some companies explicitly mention visa sponsorship or relocation support in job descriptions. Expanding searches across startup and enterprise ATS platforms may increase visibility.",
      confidence: "medium",
      category: "international",
    });
  }

  // 5. Remote
  if (hasRemote(modifiers)) {
    signals.push({
      id: "strategy-remote",
      title: "Remote roles often appear across multiple ATS systems",
      description:
        "Remote roles may be distributed across many company career pages. Expanding searches across different ATS platforms can increase discovery.",
      confidence: "medium",
      category: "strategy",
    });
  }

  // 6. Search breadth
  if (expandedJobTitles.length > 3) {
    signals.push({
      id: "search-breadth",
      title: "Expanded role search active",
      description:
        "Your query was expanded to include multiple related titles. This can increase the chance of discovering roles that use slightly different naming conventions.",
      confidence: "high",
      category: "search",
    });
  }

  // 7. Company discovery
  if (
    Array.isArray(companyDiscoveryQueries) &&
    companyDiscoveryQueries.length > 0
  ) {
    signals.push({
      id: "strategy-company-discovery",
      title: "Company discovery enabled",
      description:
        "Exploring companies hiring in your target industry may uncover roles before they appear on major job boards.",
      confidence: "medium",
      category: "strategy",
    });
  }

  return signals;
}
