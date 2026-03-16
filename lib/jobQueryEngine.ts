// ============ TYPES ============

import type { OpportunitySignal } from "@/lib/opportunitySignals";
import { generateOpportunitySignals } from "@/lib/opportunitySignals";
import {
  ROLE_ALIASES,
  THAI_ROLE_ALIASES,
  ROLE_CATEGORY_MAP,
  BROADER_ADDITIONS,
} from "@/content/roleDictionaries";
import { LOCATION_EXPANSIONS } from "@/content/locationDictionaries";
import { atsBundles } from "@/content/atsBundles";

export type RoleCategory =
  | "tech"
  | "business"
  | "legal_compliance"
  | "data_analytics"
  | "marketing_growth"
  | "operations_strategy"
  | "general";

export type LanguageMode = "auto" | "en" | "th";

export type TitleLevel =
  | "any"
  | "junior_associate"
  | "senior"
  | "lead_principal"
  | "manager"
  | "director_plus";

export type Seniority =
  | "entry"
  | "mid"
  | "senior"
  | "unknown";

export type QueryPack = {
  label: string;
  description: string;
  priority: number;
  /** Level 1: exact role + strict filters */
  level1Queries: string[];
  /** Level 2: expanded/broader role + same filters */
  level2Queries: string[];
  /** Level 3: broad career page search (no ATS restriction where applicable) */
  level3Queries: string[];
  /** Best search URLs for this pack (level1 first, then level2, then level3) for "Start My Search" */
  googleUrls: string[];
  /** For Fresh Jobs pack: recency key -> URLs */
  recencyUrls?: { label: string; urls: string[] }[];
};

export type UserControls = {
  visaMode: boolean;
  remoteMode: boolean;
  entryLevelMode: boolean;
  startupMode: boolean;
  enterpriseMode: boolean;
  freshMode: boolean;
  internationalMode: boolean;
  languageMode?: LanguageMode;
  /** Optional, user-controlled search preference for job-title wording. */
  titleLevel?: TitleLevel;
};

export const DEFAULT_USER_CONTROLS: UserControls = {
  visaMode: false,
  remoteMode: false,
  entryLevelMode: false,
  startupMode: false,
  enterpriseMode: false,
  freshMode: false,
  internationalMode: false,
  languageMode: "auto",
   titleLevel: "any",
};

export type ParsedInput = {
  normalizedQuery: string;
  aliasAppliedQuery: string;
  roleCategory: RoleCategory;
  detectedBaseRoles: string[];
  expandedJobTitles: string[];
  locations: string[];
  modifiers: string[];
  seniority: Seniority;
  usedFallbackPhrase: boolean;
  fallbackPhrase?: string;
  similarRoles: string[];
  /** Optional, user-controlled preference that shapes job-title wording only. */
  titleLevel?: TitleLevel;
};

export type ProTemplate = {
  label: string;
  queries: string[];
  googleUrls: string[];
};

export type JobSearchPlan = {
  intent: "job_search";
  userQuery: string;
  normalizedQuery: string;
  roleCategory: RoleCategory;
  detectedBaseRoles: string[];
  expandedJobTitles: string[];
  locations: string[];
  modifiers: string[];
  seniority: Seniority;
  usedFallbackPhrase: boolean;
  fallbackPhrase?: string;
  similarRoles: string[];
  detectedSummary: string[];
  atsBundles: {
    startup: string[];
    modern: string[];
    enterprise: string[];
  };
  exclusions: string[];
  packs: QueryPack[];
  companyDiscoveryQueries: string[];
  proTemplates: ProTemplate[];
  shareUrl: string;
  /** Opportunity signals derived from search strategy (heuristics only). */
  signals?: OpportunitySignal[];
};

// ============ ROLE ALIAS MAP (longest match first) ============

const ALIAS_ORDERED = [...ROLE_ALIASES].sort((a, b) => b[0].length - a[0].length);
const THAI_ALIAS_ORDERED = [...THAI_ROLE_ALIASES].sort((a, b) => b[0].length - a[0].length);

// ============ ROLE DICTIONARIES (curated, easy to edit) ============

const ALL_BASE_ROLES: { key: string; category: RoleCategory }[] = [];

for (const [categoryKey, map] of Object.entries(ROLE_CATEGORY_MAP)) {
  if (!map) continue;
  const category = categoryKey as RoleCategory;
  for (const key of Object.keys(map)) {
    ALL_BASE_ROLES.push({ key, category });
  }
}
ALL_BASE_ROLES.sort((a, b) => b.key.length - a.key.length);

// ============ LOCATION DICTIONARY ============

// ============ MODIFIERS ============

const VISA_KEYWORDS = [
  "visa",
  "sponsorship",
  "sponsor",
  "h1b",
  "h-1b",
  "work visa",
  "opt",
  "cpt",
  "relocation",
];
const REMOTE_KEYWORDS = ["remote", "hybrid", "onsite", "work from home", "wfh"];
const ENTRY_KEYWORDS = [
  "entry level",
  "entry-level",
  "junior",
  "new grad",
  "graduate",
  "associate",
];
const SENIOR_KEYWORDS = ["senior", "staff", "principal", "lead"];
const STARTUP_KEYWORD = "startup";
const ENTERPRISE_KEYWORD = "enterprise";
const FRESH_KEYWORDS = ["fresh", "recent", "latest"];

const DEFAULT_EXCLUSIONS = [
  "-site:linkedin.com",
  "-site:indeed.com",
  "-site:glassdoor.com",
  "-intitle:staffing",
  "-intitle:recruiting",
];

const ENTRY_LEVEL_EXCLUSIONS = ["-senior", "-staff", "-principal", "-lead"];

const TITLE_LEVEL_KEYWORDS: Record<
  TitleLevel,
  { include: string[]; exclude: string[] }
> = {
  any: { include: [], exclude: [] },
  junior_associate: {
    include: ["junior", "associate", "entry level", "entry-level", "new grad"],
    exclude: ["senior", "staff", "principal", "lead", "director"],
  },
  senior: {
    include: ["senior"],
    exclude: [],
  },
  lead_principal: {
    include: ["lead", "principal", "staff"],
    exclude: [],
  },
  manager: {
    include: ["manager"],
    exclude: [],
  },
  director_plus: {
    include: ["director", "head of", "vice president", "vp"],
    exclude: [],
  },
};

function getTitleLevelKeywords(
  titleLevel: TitleLevel | undefined
): { include: string[]; exclude: string[] } {
  if (!titleLevel) return TITLE_LEVEL_KEYWORDS.any;
  return TITLE_LEVEL_KEYWORDS[titleLevel] ?? TITLE_LEVEL_KEYWORDS.any;
}

function buildTitleLevelIncludeClause(
  titleLevel: TitleLevel | undefined
): string {
  const { include } = getTitleLevelKeywords(titleLevel);
  if (!include.length) return "";
  if (include.length === 1) {
    return `"${include[0]}"`;
  }
  return `(${include.map((t) => `"${t}"`).join(" OR ")})`;
}

// ============ DETECT LOCATIONS ============

/** Use dictionary first; if no match, infer location-like phrases from original input (preserved as plain text for search). */
export function detectLocations(originalInput: string, normalizedInput: string): string[] {
  const locations: string[] = [];
  const norm = normalizedInput.toLowerCase();
  for (const [key, expansion] of Object.entries(LOCATION_EXPANSIONS)) {
    if (norm.includes(key)) {
      locations.push(...expansion);
    }
  }
  const uniqueFromDict = Array.from(new Set(locations));
  if (uniqueFromDict.length > 0) return uniqueFromDict;

  // Fallback: strip known role/modifier tokens and treat remainder as location phrase(s)
  const roleKeys = ALL_BASE_ROLES.map((r) => r.key);
  const modifierTokens = [
    ...VISA_KEYWORDS,
    ...REMOTE_KEYWORDS,
    ...ENTRY_KEYWORDS,
    ...SENIOR_KEYWORDS,
    STARTUP_KEYWORD,
    ENTERPRISE_KEYWORD,
    ...FRESH_KEYWORDS,
  ];
  let remaining = norm;
  for (const key of roleKeys) {
    if (remaining.includes(key)) {
      remaining = remaining.replace(
        new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        " "
      );
    }
  }
  for (const tok of modifierTokens) {
    remaining = remaining.replace(new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " ");
  }
  remaining = remaining.replace(/\s+/g, " ").trim();
  if (remaining.length > 0) {
    return [remaining];
  }
  return [];
}

// ============ ATS BUNDLES ============

const ATS_STARTUP = [
  "boards.greenhouse.io",
  "job-boards.greenhouse.io",
  "jobs.lever.co",
  "jobs.ashbyhq.com",
];
const ATS_MODERN = [
  "jobs.workable.com",
  "apply.workable.com",
  "jobs.recruitee.com",
  "jobs.bamboohr.com",
];
const ATS_ENTERPRISE = [
  "myworkdayjobs.com",
  "jobs.icims.com",
  "jobs.jobvite.com",
  "jobs.smartrecruiters.com",
];

// ============ CORE FUNCTIONS ============

export function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Replace alias phrases with canonical base roles (longest match first). English first, then Thai unless language mode narrows. */
export function applyAliases(input: string, languageMode: LanguageMode = "auto"): string {
  let result = input.toLowerCase();
  const useThai = languageMode === "auto" || languageMode === "th";

  for (const [alias, canonical] of ALIAS_ORDERED) {
    const re = new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, canonical);
  }
  if (useThai) {
    for (const [alias, canonical] of THAI_ALIAS_ORDERED) {
      if (result.includes(alias)) {
        result = result.split(alias).join(canonical);
      }
    }
  }
  return result;
}

const CATEGORY_LABELS: Record<RoleCategory, string> = {
  tech: "Tech",
  business: "Business",
  legal_compliance: "Legal & Compliance",
  data_analytics: "Data & Analytics",
  marketing_growth: "Marketing & Growth",
  operations_strategy: "Operations & Strategy",
  general: "General",
};

const SENIORITY_LABELS: Record<Seniority, string> = {
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior",
  unknown: "Unknown",
};

export function parseInput(input: string, controls?: Partial<UserControls>): ParsedInput {
  const normalizedQuery = normalizeInput(input);
  const languageMode: LanguageMode = controls?.languageMode ?? "auto";
  const titleLevel: TitleLevel | undefined = controls?.titleLevel ?? "any";
  const withAliases = applyAliases(normalizedQuery, languageMode);
  const words = withAliases.split(" ").filter(Boolean);
  const detectedBaseRoles: string[] = [];
  let roleCategory: RoleCategory = "general";
  const modifiers: string[] = [];
  let seniority: Seniority = "unknown";

  let remaining = withAliases;

  // Detect base roles (greedy longest match)
  for (const { key, category } of ALL_BASE_ROLES) {
    if (remaining.includes(key)) {
      if (!detectedBaseRoles.includes(key)) {
        detectedBaseRoles.push(key);
      }
      if (roleCategory === "general") roleCategory = category;
      remaining = remaining.replace(
        new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        " "
      );
    }
  }

  // Detect locations (dictionary + fallback)
  const finalLocations = detectLocations(input, normalizedQuery);

  // Detect modifiers from text
  if (VISA_KEYWORDS.some((k) => normalizedQuery.includes(k))) {
    modifiers.push("visa_sponsorship");
  }
  if (REMOTE_KEYWORDS.some((k) => normalizedQuery.includes(k))) {
    modifiers.push("remote");
  }
  if (ENTRY_KEYWORDS.some((k) => normalizedQuery.includes(k))) {
    modifiers.push("entry_level");
    if (seniority === "unknown") seniority = "entry";
  }
  if (SENIOR_KEYWORDS.some((k) => normalizedQuery.includes(k))) {
    modifiers.push("senior");
    seniority = "senior";
  }
  if (normalizedQuery.includes(STARTUP_KEYWORD)) modifiers.push("startup");
  if (normalizedQuery.includes(ENTERPRISE_KEYWORD)) modifiers.push("enterprise");
  if (FRESH_KEYWORDS.some((k) => normalizedQuery.includes(k))) {
    modifiers.push("fresh");
  }

  // Merge UI controls
  if (controls?.visaMode && !modifiers.includes("visa_sponsorship")) {
    modifiers.push("visa_sponsorship");
  }
  if (controls?.internationalMode) {
    if (!modifiers.includes("visa_sponsorship")) modifiers.push("visa_sponsorship");
    if (!modifiers.includes("international")) modifiers.push("international");
  }
  if (controls?.remoteMode && !modifiers.includes("remote")) {
    modifiers.push("remote");
  }
  if (controls?.entryLevelMode) {
    if (!modifiers.includes("entry_level")) modifiers.push("entry_level");
    seniority = "entry";
  }
  if (controls?.startupMode && !modifiers.includes("startup")) {
    modifiers.push("startup");
  }
  if (controls?.enterpriseMode && !modifiers.includes("enterprise")) {
    modifiers.push("enterprise");
  }
  if (controls?.freshMode && !modifiers.includes("fresh")) {
    modifiers.push("fresh");
  }

  if (seniority === "unknown") seniority = "mid";

  const expandedJobTitles =
    detectedBaseRoles.length > 0
      ? expandJobTitles(detectedBaseRoles)
      : [];

  const usedFallbackPhrase = detectedBaseRoles.length === 0 && normalizedQuery.length > 0;
  const fallbackPhrase = usedFallbackPhrase ? normalizedQuery : undefined;

  const roleForSimilar =
    detectedBaseRoles[0] ?? (fallbackPhrase?.trim() || normalizedQuery);
  const similarRoles = getSimilarRoles(roleForSimilar);

  return {
    normalizedQuery,
    aliasAppliedQuery: withAliases,
    roleCategory,
    detectedBaseRoles,
    expandedJobTitles,
    locations: finalLocations,
    modifiers: Array.from(new Set(modifiers)),
    seniority,
    usedFallbackPhrase,
    fallbackPhrase,
    similarRoles,
    titleLevel,
  };
}

export function expandJobTitles(baseRoles: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const base of baseRoles) {
    const lower = base.toLowerCase();
    let found = false;
    for (const [, map] of Object.entries(ROLE_CATEGORY_MAP)) {
      if (!map || Object.keys(map).length === 0) continue;
      const expansions = map[lower];
      if (expansions) {
        for (const title of expansions) {
          const t = title.toLowerCase();
          if (!seen.has(t)) {
            seen.add(t);
            result.push(title);
          }
        }
        found = true;
        break;
      }
    }
    if (!found && !seen.has(lower)) {
      seen.add(lower);
      result.push(base);
    }
  }
  return result;
}

/** Level 2 expansions = level 1 + broader additions for each base role. */
export function expandJobTitlesBroader(baseRoles: string[]): string[] {
  const level1 = expandJobTitles(baseRoles);
  const seen = new Set(level1.map((t) => t.toLowerCase()));
  const result = [...level1];
  for (const base of baseRoles) {
    const lower = base.toLowerCase();
    const extra = BROADER_ADDITIONS[lower];
    if (extra) {
      for (const title of extra) {
        const t = title.toLowerCase();
        if (!seen.has(t)) {
          seen.add(t);
          result.push(title);
        }
      }
    }
  }
  return result;
}

export function buildRoleClause(
  expandedTitles: string[],
  fallbackPhrase?: string
): string {
  if (expandedTitles.length === 1) {
    return `"${expandedTitles[0]}"`;
  }
  if (expandedTitles.length > 1) {
    return `(${expandedTitles.map((t) => `"${t}"`).join(" OR ")})`;
  }
  if (fallbackPhrase && fallbackPhrase.trim()) {
    return `"${fallbackPhrase.trim()}"`;
  }
  return "";
}

export function buildLocationClause(locations: string[]): string {
  if (locations.length === 0) return "";
  if (locations.length === 1) return locations[0];
  return `(${locations.join(" OR ")})`;
}

export function buildExclusionClause(exclusions: string[]): string {
  return exclusions.join(" ");
}

export function buildVisaClause(modifiers: string[]): string {
  if (!modifiers.some((m) => m === "visa_sponsorship")) return "";
  return '( "visa sponsorship" OR "visa sponsor" OR "work visa" OR "h1b" OR "H-1B" OR "OPT" OR "CPT" OR "relocation" )';
}

export function buildRemoteClause(modifiers: string[]): string {
  if (!modifiers.some((m) => m === "remote")) return "";
  return '"remote"';
}

export function buildDetectedSummary(parsed: ParsedInput): string[] {
  const lines: string[] = [];
  lines.push(`Role category: ${CATEGORY_LABELS[parsed.roleCategory]}`);
  if (parsed.expandedJobTitles.length > 0) {
    lines.push(
      `Expanded titles: ${parsed.expandedJobTitles.slice(0, 12).join(", ")}${parsed.expandedJobTitles.length > 12 ? "…" : ""}`
    );
  }
  if (parsed.locations.length > 0) {
    lines.push(`Location: ${parsed.locations.join(", ")}`);
  }
  if (parsed.modifiers.length > 0) {
    const modLabels = parsed.modifiers.map((m) =>
      m === "visa_sponsorship"
        ? "Visa Sponsorship"
        : m === "entry_level"
          ? "Entry Level"
          : m.charAt(0).toUpperCase() + m.slice(1)
    );
    lines.push(`Filters: ${modLabels.join(", ")}`);
  }
  lines.push(`Seniority: ${SENIORITY_LABELS[parsed.seniority]}`);
  if (parsed.usedFallbackPhrase && parsed.fallbackPhrase) {
    lines.push(
      "Fallback: We used your exact phrase because we did not match a standard role."
    );
  }
  return lines;
}

export function buildGoogleUrl(query: string, recency?: "d" | "w" | "m"): string {
  const encoded = encodeURIComponent(query);
  let url = `https://www.google.com/search?q=${encoded}`;
  if (recency === "d") url += "&tbs=qdr:d";
  if (recency === "w") url += "&tbs=qdr:w";
  if (recency === "m") url += "&tbs=qdr:m";
  return url;
}

/** Build shareable URL with query and chip states (path + search params; client can prepend origin). */
export function buildShareUrl(userQuery: string, controls: UserControls): string {
  const params = new URLSearchParams();
  params.set("q", userQuery.trim());
  params.set("visa", controls.visaMode ? "1" : "0");
  params.set("remote", controls.remoteMode ? "1" : "0");
  params.set("entryLevel", controls.entryLevelMode ? "1" : "0");
  params.set("startup", controls.startupMode ? "1" : "0");
  params.set("enterprise", controls.enterpriseMode ? "1" : "0");
  params.set("fresh", controls.freshMode ? "1" : "0");
  params.set("international", controls.internationalMode ? "1" : "0");
  if (controls.titleLevel && controls.titleLevel !== "any") {
    params.set("titleLevel", controls.titleLevel);
  }
  return `/?${params.toString()}`;
}

const INDUSTRY_HINTS: Record<RoleCategory, string[]> = {
  tech: ["technology", "software", "AI", "SaaS", "fintech"],
  legal_compliance: ["fintech", "banking", "technology", "healthcare", "consulting"],
  business: ["SaaS", "startup", "technology", "fintech"],
  data_analytics: ["AI", "SaaS", "fintech", "analytics"],
  marketing_growth: ["startup", "SaaS", "consumer tech"],
  operations_strategy: ["startup", "consulting", "fintech", "technology"],
  general: ["technology", "companies"],
};

/** Company discovery queries for "Discover Hiring Companies" section. */
export function generateCompanyDiscoveryQueries(parsed: ParsedInput): string[] {
  const hints = INDUSTRY_HINTS[parsed.roleCategory] ?? ["companies"];
  const locParts = parsed.locations
    .filter((l) => l.toLowerCase() !== "remote")
    .slice(0, 2);
  const locationStr = locParts.length > 0 ? locParts.join(" ") : "";
  const queries: string[] = [];
  for (const hint of hints.slice(0, 2)) {
    if (locationStr) {
      queries.push(`${hint} companies ${locationStr} careers`);
      queries.push(`${hint} companies ${locationStr} hiring`);
    } else {
      queries.push(`${hint} companies careers`);
    }
  }
  queries.push(`site:boards.greenhouse.io ${locationStr} careers`.trim());
  queries.push(`site:jobs.lever.co ${locationStr} careers`.trim());
  return queries.filter(Boolean).slice(0, 6);
}

/** "Search Like a Pro" template packs (labels and descriptions are configured via content/templates.ts). */
export function generateProTemplates(parsed: ParsedInput): ProTemplate[] {
  const roleClause = buildRoleClause(parsed.expandedJobTitles, parsed.fallbackPhrase);
  const locationClause = buildLocationClause(
    parsed.locations.filter((l) => l.toLowerCase() !== "remote")
  );
  const base = [roleClause, locationClause].filter(Boolean).join(" ");
  const exclusions = [...DEFAULT_EXCLUSIONS];
  if (parsed.seniority === "entry") exclusions.push(...ENTRY_LEVEL_EXCLUSIONS);
  const titleKeywords = getTitleLevelKeywords(parsed.titleLevel);
  if (titleKeywords.exclude.length) {
    exclusions.push(...titleKeywords.exclude.map((kw) => `-${kw}`));
  }
  const exclusionClause = buildExclusionClause(exclusions);
  const careerSuffix = `(inurl:careers OR inurl:jobs OR intitle:careers) ${exclusionClause}`.trim();
  const templates: ProTemplate[] = [];

  const ATS_STARTUP = atsBundles.find((b) => b.id === "startup")?.domains ?? [
    "boards.greenhouse.io",
    "job-boards.greenhouse.io",
    "jobs.lever.co",
    "jobs.ashbyhq.com",
  ];
  const ATS_MODERN = atsBundles.find((b) => b.id === "modern")?.domains ?? [
    "jobs.workable.com",
    "apply.workable.com",
    "jobs.recruitee.com",
    "jobs.bamboohr.com",
  ];
  const ATS_ENTERPRISE = atsBundles.find((b) => b.id === "enterprise")?.domains ?? [
    "myworkdayjobs.com",
    "jobs.icims.com",
    "jobs.jobvite.com",
    "jobs.smartrecruiters.com",
  ];

  const startupQueries = ATS_STARTUP.map((d) => `${base} site:${d}`.trim()).filter(Boolean);
  if (startupQueries.length > 0) {
    templates.push({
      label: "Startup Jobs",
      queries: startupQueries,
      googleUrls: startupQueries.map((q) => buildGoogleUrl(q)),
    });
  }

  const remoteBase = [roleClause, '"remote"'].filter(Boolean).join(" ");
  const remoteQueries = [
    `${remoteBase} site:boards.greenhouse.io`,
    `${remoteBase} site:jobs.lever.co`,
    `${remoteBase} site:myworkdayjobs.com`,
  ].filter(Boolean);
  if (remoteQueries.length > 0) {
    templates.push({
      label: "Remote Jobs",
      queries: remoteQueries,
      googleUrls: remoteQueries.map((q) => buildGoogleUrl(q)),
    });
  }

  const enterpriseQueries = ATS_ENTERPRISE.map((d) => `${base} site:${d}`.trim()).filter(Boolean);
  if (enterpriseQueries.length > 0) {
    templates.push({
      label: "Enterprise Jobs",
      queries: enterpriseQueries,
      googleUrls: enterpriseQueries.map((q) => buildGoogleUrl(q)),
    });
  }

  if (parsed.seniority === "entry" && parsed.roleCategory === "tech") {
    const entryBase = [roleClause, locationClause, exclusionClause].filter(Boolean).join(" ");
    const entryQueries = [
      `${entryBase} ${careerSuffix}`.trim(),
      ...ATS_STARTUP.map((d) => `${entryBase} site:${d}`.trim()),
    ].filter(Boolean);
    if (entryQueries.length > 0) {
      templates.push({
        label: "Entry-Level Tech Roles",
        queries: entryQueries,
        googleUrls: entryQueries.map((q) => buildGoogleUrl(q)),
      });
    }
  }

  if (parsed.modifiers.includes("visa_sponsorship") || parsed.modifiers.includes("international")) {
    const visaClause = buildVisaClause(parsed.modifiers);
    const visaBase = [base, visaClause].filter(Boolean).join(" ");
    const visaQueries = [
      `${visaBase} site:boards.greenhouse.io`,
      `${visaBase} site:jobs.lever.co`,
      `${visaBase} site:myworkdayjobs.com`,
    ].filter(Boolean);
    if (visaQueries.length > 0) {
      templates.push({
        label: "International Candidate Search",
        queries: visaQueries,
        googleUrls: visaQueries.map((q) => buildGoogleUrl(q)),
      });
    }
  }

  if (parsed.roleCategory === "legal_compliance") {
    const legalQueries = [
      `${base} ${careerSuffix}`.trim(),
      ...ATS_STARTUP.map((d) => `${base} site:${d}`.trim()),
      ...ATS_ENTERPRISE.map((d) => `${base} site:${d}`.trim()),
    ].filter(Boolean);
    if (legalQueries.length > 0) {
      templates.push({
        label: "In-House Legal Roles",
        queries: legalQueries,
        googleUrls: legalQueries.map((q) => buildGoogleUrl(q)),
      });
    }
  }

  return templates;
}

/** Assign priority for ordering; lower = higher priority. */
function packPriority(
  label: string,
  modifiers: string[]
): number {
  const visa = modifiers.includes("visa_sponsorship");
  const remote = modifiers.includes("remote");
  const startup = modifiers.includes("startup");
  const enterprise = modifiers.includes("enterprise");
  const fresh = modifiers.includes("fresh");

  if (label === "Visa Signal Search") return visa ? 0 : 50;
  if (label === "Remote Search") return remote ? 1 : 51;
  if (label === "Hidden Career Pages") return 2;
  if (label === "Startup ATS Jobs") return startup ? 3 : 4;
  if (label === "Modern ATS Jobs") return 5;
  if (label === "Enterprise ATS Jobs") return enterprise ? 3 : 6;
  if (label === "Fresh Jobs") return fresh ? 4 : 7;
  return 10;
}

export function prioritizePacks(
  packs: QueryPack[],
  modifiers: string[]
): QueryPack[] {
  return [...packs].sort(
    (a, b) => packPriority(a.label, modifiers) - packPriority(b.label, modifiers)
  );
}

/** Returns top 3 search URLs by pack preference (for "Start My Search" button). */
export function getTopSearchUrls(packs: QueryPack[], modifiers: string[]): string[] {
  const hasVisa = modifiers.includes("visa_sponsorship") || modifiers.includes("international");
  const hasRemote = modifiers.includes("remote");

  const byLabel = (label: string) => packs.find((p) => p.label === label);
  const takeFirst = (pack: QueryPack | undefined, n: number) =>
    pack?.googleUrls?.filter(Boolean).slice(0, n) ?? [];

  const urls: string[] = [];
  if (hasVisa) {
    urls.push(...takeFirst(byLabel("Visa Signal Search"), 1));
    urls.push(...takeFirst(byLabel("Startup ATS Jobs"), 1));
    urls.push(...takeFirst(byLabel("Hidden Career Pages"), 1));
  } else if (hasRemote) {
    urls.push(...takeFirst(byLabel("Remote Search"), 1));
    urls.push(...takeFirst(byLabel("Startup ATS Jobs"), 1));
    urls.push(...takeFirst(byLabel("Hidden Career Pages"), 1));
  } else {
    urls.push(...takeFirst(byLabel("Startup ATS Jobs"), 1));
    urls.push(...takeFirst(byLabel("Enterprise ATS Jobs"), 1));
    urls.push(...takeFirst(byLabel("Hidden Career Pages"), 1));
  }
  return urls.filter(Boolean).slice(0, 3);
}

/** Open top search URLs in new tabs with a short delay between each. */
export function openTopSearches(urls: string[]): void {
  urls.forEach((url, i) => {
    setTimeout(
      () => window.open(url, "_blank", "noopener"),
      i * 250
    );
  });
}

/** All role titles from dictionaries for similarity matching (unique, lowercase). */
function getAllRoleTitles(): { key: string; titles: string[] }[] {
  const out: { key: string; titles: string[] }[] = [];
  for (const [, map] of Object.entries(ROLE_CATEGORY_MAP)) {
    if (!map || Object.keys(map).length === 0) continue;
    for (const [key, titles] of Object.entries(map)) {
      out.push({
        key,
        titles: Array.from(new Set(titles.map((t) => t.toLowerCase()))),
      });
    }
  }
  return out;
}

const ALL_ROLE_ENTRIES = getAllRoleTitles();

/** Suggest similar roles when the detected role is uncommon or no base role matched. Uses role dictionaries. */
export function getSimilarRoles(role: string): string[] {
  const normalized = normalizeInput(role);
  if (!normalized) return [];
  const words = normalized.split(/\s+/).filter((w) => w.length > 1);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const { key, titles } of ALL_ROLE_ENTRIES) {
    const keyWords = key.split(/\s+/);
    const titleWords = titles.flatMap((t) => t.split(/\s+/));
    const allWords = Array.from(new Set([...keyWords, ...titleWords]));
    const matchScore = words.filter((w) =>
      allWords.some((aw) => aw.includes(w) || w.includes(aw))
    ).length;
    if (matchScore > 0) {
      for (const t of titles) {
        const lower = t.toLowerCase();
        if (!seen.has(lower) && lower !== normalized) {
          seen.add(lower);
          result.push(t);
        }
      }
    }
  }

  return result.slice(0, 8);
}

function buildLevelQueries(
  roleClauseL1: string,
  roleClauseL2: string,
  locationClause: string,
  exclusionClause: string,
  careerPageSuffix: string
): { level1: string[]; level2: string[]; level3: string[] } {
  const baseL1 = [roleClauseL1, locationClause].filter(Boolean).join(" ");
  const baseL2 = [roleClauseL2, locationClause].filter(Boolean).join(" ");
  const level1 = [baseL1 ? `${baseL1} ${careerPageSuffix}`.trim() : ""].filter(Boolean);
  const level2 = [baseL2 ? `${baseL2} ${careerPageSuffix}`.trim() : ""].filter(Boolean);
  const level3 = [baseL2 ? `${baseL2} ${careerPageSuffix}`.trim() : ""].filter(Boolean);
  return { level1, level2, level3 };
}

export function generateQueryPacks(parsed: ParsedInput): QueryPack[] {
  const {
    expandedJobTitles,
    detectedBaseRoles,
    locations,
    modifiers,
    usedFallbackPhrase,
    fallbackPhrase,
  } = parsed;
  const roleClauseL1 = buildRoleClause(expandedJobTitles, fallbackPhrase);
  const expandedL2 =
    usedFallbackPhrase || detectedBaseRoles.length === 0
      ? expandedJobTitles
      : expandJobTitlesBroader(detectedBaseRoles);
  const roleClauseL2 = buildRoleClause(
    expandedL2.length > 0 ? expandedL2 : [],
    fallbackPhrase
  );
  const locationClause = buildLocationClause(
    locations.filter((l) => l.toLowerCase() !== "remote")
  );
  const exclusions = [...DEFAULT_EXCLUSIONS];
  if (parsed.seniority === "entry") {
    exclusions.push(...ENTRY_LEVEL_EXCLUSIONS);
  }
  const titleKeywords = getTitleLevelKeywords(parsed.titleLevel);
  if (titleKeywords.exclude.length) {
    exclusions.push(...titleKeywords.exclude.map((kw) => `-${kw}`));
  }
  const exclusionClause = buildExclusionClause(exclusions);
  const visaClause = buildVisaClause(modifiers);
  const hasVisa = modifiers.includes("visa_sponsorship");
  const hasRemote = modifiers.includes("remote");

  const titleIncludeClause = buildTitleLevelIncludeClause(parsed.titleLevel);

  const careerPageSuffix = `(inurl:careers OR inurl:jobs OR intitle:careers) ${exclusionClause}`.trim();
  const careerPageSuffix2 = `(inurl:career OR inurl:jobs) ${exclusionClause}`.trim();

  const packs: QueryPack[] = [];

  if (!roleClauseL1 && !fallbackPhrase?.trim()) {
    return packs;
  }

  const hiddenLevels = buildLevelQueries(
    [roleClauseL1, titleIncludeClause].filter(Boolean).join(" "),
    [roleClauseL2, titleIncludeClause].filter(Boolean).join(" "),
    locationClause,
    exclusionClause,
    careerPageSuffix
  );
  const hiddenLevelsAlt = buildLevelQueries(
    [roleClauseL1, titleIncludeClause].filter(Boolean).join(" "),
    [roleClauseL2, titleIncludeClause].filter(Boolean).join(" "),
    locationClause,
    exclusionClause,
    careerPageSuffix2
  );
  const hiddenL1 = [
    hiddenLevels.level1[0],
    hiddenLevelsAlt.level1[0],
  ].filter(Boolean);
  const hiddenL2 = [
    hiddenLevels.level2[0],
    hiddenLevelsAlt.level2[0],
  ].filter(Boolean);
  const hiddenL3 = [
    hiddenLevels.level3[0],
    hiddenLevelsAlt.level3[0],
  ].filter(Boolean);
  const hiddenUrls = [
    ...hiddenL1.map((q) => buildGoogleUrl(q)),
    ...hiddenL2.map((q) => buildGoogleUrl(q)),
    ...hiddenL3.map((q) => buildGoogleUrl(q)),
  ].filter(Boolean);
  packs.push({
    label: "Hidden Career Pages",
    description: "Searches company career pages directly.",
    priority: packPriority("Hidden Career Pages", modifiers),
    level1Queries: hiddenL1,
    level2Queries: hiddenL2,
    level3Queries: hiddenL3,
    googleUrls: hiddenUrls,
  });

  const baseL1 = [roleClauseL1, titleIncludeClause, locationClause].filter(Boolean).join(" ");
  const baseL2 = [roleClauseL2, titleIncludeClause, locationClause].filter(Boolean).join(" ");
  const broadSuffix = `(inurl:careers OR inurl:jobs OR intitle:careers) ${exclusionClause}`.trim();

  const ATS_STARTUP = atsBundles.find((b) => b.id === "startup")?.domains ?? [
    "boards.greenhouse.io",
    "job-boards.greenhouse.io",
    "jobs.lever.co",
    "jobs.ashbyhq.com",
  ];
  const ATS_MODERN = atsBundles.find((b) => b.id === "modern")?.domains ?? [
    "jobs.workable.com",
    "apply.workable.com",
    "jobs.recruitee.com",
    "jobs.bamboohr.com",
  ];
  const ATS_ENTERPRISE = atsBundles.find((b) => b.id === "enterprise")?.domains ?? [
    "myworkdayjobs.com",
    "jobs.icims.com",
    "jobs.jobvite.com",
    "jobs.smartrecruiters.com",
  ];

  const startupL1 = ATS_STARTUP.map((d) => `${baseL1} site:${d}`.trim());
  const startupL2 = ATS_STARTUP.map((d) => `${baseL2} site:${d}`.trim());
  const startupL3 = baseL2 ? [`${baseL2} ${broadSuffix}`.trim()] : [];
  packs.push({
    label: "Startup ATS Jobs",
    description: "Companies using Greenhouse, Lever, or Ashby.",
    priority: packPriority("Startup ATS Jobs", modifiers),
    level1Queries: startupL1,
    level2Queries: startupL2,
    level3Queries: startupL3,
    googleUrls: [
      ...startupL1.map((q) => buildGoogleUrl(q)),
      ...startupL2.map((q) => buildGoogleUrl(q)),
      ...startupL3.map((q) => buildGoogleUrl(q)),
    ],
  });

  const modernL1 = ATS_MODERN.map((d) => `${baseL1} site:${d}`.trim());
  const modernL2 = ATS_MODERN.map((d) => `${baseL2} site:${d}`.trim());
  const modernL3 = baseL2 ? [`${baseL2} ${broadSuffix}`.trim()] : [];
  packs.push({
    label: "Modern ATS Jobs",
    description: "Workable, Recruitee, BambooHR and similar.",
    priority: packPriority("Modern ATS Jobs", modifiers),
    level1Queries: modernL1,
    level2Queries: modernL2,
    level3Queries: modernL3,
    googleUrls: [
      ...modernL1.map((q) => buildGoogleUrl(q)),
      ...modernL2.map((q) => buildGoogleUrl(q)),
      ...modernL3.map((q) => buildGoogleUrl(q)),
    ],
  });

  const enterpriseL1 = ATS_ENTERPRISE.map((d) => `${baseL1} site:${d}`.trim());
  const enterpriseL2 = ATS_ENTERPRISE.map((d) => `${baseL2} site:${d}`.trim());
  const enterpriseL3 = baseL2 ? [`${baseL2} ${broadSuffix}`.trim()] : [];
  packs.push({
    label: "Enterprise ATS Jobs",
    description: "Large companies using Workday, iCIMS, or SmartRecruiters.",
    priority: packPriority("Enterprise ATS Jobs", modifiers),
    level1Queries: enterpriseL1,
    level2Queries: enterpriseL2,
    level3Queries: enterpriseL3,
    googleUrls: [
      ...enterpriseL1.map((q) => buildGoogleUrl(q)),
      ...enterpriseL2.map((q) => buildGoogleUrl(q)),
      ...enterpriseL3.map((q) => buildGoogleUrl(q)),
    ],
  });

  if (hasVisa) {
    const visaBase = [baseL1, visaClause].filter(Boolean).join(" ");
    const visaBaseL2 = [baseL2, visaClause].filter(Boolean).join(" ");
    const visaL1 = [
      `${visaBase} site:boards.greenhouse.io`,
      `${visaBase} site:jobs.lever.co`,
      `${visaBase} site:myworkdayjobs.com`,
      `${visaBase} site:jobs.smartrecruiters.com`,
      visaBase.trim(),
    ];
    const visaL2 = [
      `${visaBaseL2} site:boards.greenhouse.io`,
      `${visaBaseL2} site:jobs.lever.co`,
    ];
    const visaL3 = visaBaseL2 ? [`${visaBaseL2} ${broadSuffix}`.trim()] : [];
    packs.push({
      label: "Visa Signal Search",
      description: "Queries that include visa / sponsorship signals.",
      priority: packPriority("Visa Signal Search", modifiers),
      level1Queries: visaL1,
      level2Queries: visaL2,
      level3Queries: visaL3,
      googleUrls: [
        ...visaL1.map((q) => buildGoogleUrl(q)),
        ...visaL2.map((q) => buildGoogleUrl(q)),
        ...visaL3.map((q) => buildGoogleUrl(q)),
      ],
    });
  }

  if (hasRemote) {
    const remoteBaseL1 = [roleClauseL1, '"remote"'].filter(Boolean).join(" ");
    const remoteBaseL2 = [roleClauseL2, '"remote"'].filter(Boolean).join(" ");
    const remoteL1 = [
      `${remoteBaseL1} site:boards.greenhouse.io`,
      `${remoteBaseL1} site:jobs.lever.co`,
      `${remoteBaseL1} site:myworkdayjobs.com`,
      [remoteBaseL1, exclusionClause].filter(Boolean).join(" "),
    ].filter(Boolean);
    const remoteL2 = [
      `${remoteBaseL2} site:boards.greenhouse.io`,
      `${remoteBaseL2} site:jobs.lever.co`,
    ];
    const remoteL3 = remoteBaseL2
      ? [[remoteBaseL2, exclusionClause].filter(Boolean).join(" ")]
      : [];
    packs.push({
      label: "Remote Search",
      description: "Search strategies focused on remote listings.",
      priority: packPriority("Remote Search", modifiers),
      level1Queries: remoteL1,
      level2Queries: remoteL2,
      level3Queries: remoteL3,
      googleUrls: [
        ...remoteL1.map((q) => buildGoogleUrl(q)),
        ...remoteL2.map((q) => buildGoogleUrl(q)),
        ...remoteL3.map((q) => buildGoogleUrl(q)),
      ],
    });
  }

  const freshBaseQueries = [
    hiddenL1[0],
    startupL1[0],
    modernL1[0],
    enterpriseL1[0],
  ].filter(Boolean);
  const recencyUrls: { label: string; urls: string[] }[] = [
    {
      label: "Last 24 hours",
      urls: freshBaseQueries.map((q) => buildGoogleUrl(q, "d")),
    },
    {
      label: "Last week",
      urls: freshBaseQueries.map((q) => buildGoogleUrl(q, "w")),
    },
    {
      label: "Last month",
      urls: freshBaseQueries.map((q) => buildGoogleUrl(q, "m")),
    },
  ];
  packs.push({
    label: "Fresh Jobs",
    description: "Same searches limited by recency (24h, week, month).",
    priority: packPriority("Fresh Jobs", modifiers),
    level1Queries: freshBaseQueries,
    level2Queries: [],
    level3Queries: [],
    googleUrls: recencyUrls.flatMap((r) => r.urls),
    recencyUrls,
  });

  return packs;
}

export function generateJobSearchPlan(
  userQuery: string,
  controls?: Partial<UserControls>
): JobSearchPlan {
  const normalized = normalizeInput(userQuery);
  const mergedControls: UserControls = { ...DEFAULT_USER_CONTROLS, ...controls };
  if (!normalized) {
    return {
      intent: "job_search",
      userQuery: userQuery,
      normalizedQuery: "",
      roleCategory: "general",
      detectedBaseRoles: [],
      expandedJobTitles: [],
      locations: [],
      modifiers: [],
      seniority: "unknown",
      usedFallbackPhrase: false,
      similarRoles: [],
      detectedSummary: [],
      atsBundles: {
        startup: atsBundles.find((b) => b.id === "startup")?.domains ?? [],
        modern: atsBundles.find((b) => b.id === "modern")?.domains ?? [],
        enterprise: atsBundles.find((b) => b.id === "enterprise")?.domains ?? [],
      },
      exclusions: DEFAULT_EXCLUSIONS,
      packs: [],
      companyDiscoveryQueries: [],
      proTemplates: [],
      shareUrl: buildShareUrl(userQuery, mergedControls),
    };
  }

  const parsed = parseInput(userQuery, controls);
  const exclusions = [...DEFAULT_EXCLUSIONS];
  if (parsed.seniority === "entry") {
    exclusions.push(...ENTRY_LEVEL_EXCLUSIONS);
  }
  const titleKeywords = getTitleLevelKeywords(parsed.titleLevel);
  if (titleKeywords.exclude.length) {
    exclusions.push(...titleKeywords.exclude.map((kw) => `-${kw}`));
  }

  const rawPacks = generateQueryPacks(parsed);
  const packs = prioritizePacks(rawPacks, parsed.modifiers);

  const plan: JobSearchPlan = {
    intent: "job_search",
    userQuery: userQuery,
    normalizedQuery: parsed.normalizedQuery,
    roleCategory: parsed.roleCategory,
    detectedBaseRoles: parsed.detectedBaseRoles,
    expandedJobTitles: parsed.expandedJobTitles,
    locations: parsed.locations,
    modifiers: parsed.modifiers,
    seniority: parsed.seniority,
    usedFallbackPhrase: parsed.usedFallbackPhrase,
    fallbackPhrase: parsed.fallbackPhrase,
    similarRoles: parsed.similarRoles,
    detectedSummary: buildDetectedSummary(parsed),
    atsBundles: {
      startup: atsBundles.find((b) => b.id === "startup")?.domains ?? [],
      modern: atsBundles.find((b) => b.id === "modern")?.domains ?? [],
      enterprise: atsBundles.find((b) => b.id === "enterprise")?.domains ?? [],
    },
    exclusions,
    packs,
    companyDiscoveryQueries: generateCompanyDiscoveryQueries(parsed),
    proTemplates: generateProTemplates(parsed),
    shareUrl: buildShareUrl(userQuery, mergedControls),
  };
  plan.signals = generateOpportunitySignals(plan);
  return plan;
}
