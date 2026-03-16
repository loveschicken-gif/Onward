import type { RoleCategory } from "@/lib/jobQueryEngine";

export type RoleAlias = [string, string];

export const ROLE_ALIASES: RoleAlias[] = [
  ["site reliability engineer", "devops engineer"],
  ["sre", "devops engineer"],
  ["ai engineer", "machine learning engineer"],
  ["ml engineer", "machine learning engineer"],
  ["applied ai engineer", "machine learning engineer"],
  ["business operations associate", "operations manager"],
  ["operations associate", "operations manager"],
  ["associate product manager", "product manager"],
  ["junior product manager", "product manager"],
  ["apm", "product manager"],
  ["data protection counsel", "privacy counsel"],
  ["privacy attorney", "privacy counsel"],
  ["responsible ai", "ai governance"],
  ["decision scientist", "data scientist"],
  ["gpm", "product manager"],
  ["group product manager", "product manager"],
  ["junior product manager", "product manager"],
];

export const THAI_ROLE_ALIASES: RoleAlias[] = [
  ["วิศวกรซอฟต์แวร์", "software engineer"],
  ["โปรแกรมเมอร์", "software engineer"],
  ["นักพัฒนาซอฟต์แวร์", "software engineer"],
  ["วิศวกรข้อมูล", "data engineer"],
  ["นักวิทยาศาสตร์ข้อมูล", "data scientist"],
  ["วิศวกรแมชชีนเลิร์นนิง", "machine learning engineer"],
  ["วิศวกร devops", "devops engineer"],
  ["ผู้จัดการผลิตภัณฑ์", "product manager"],
  ["นักวิเคราะห์ธุรกิจ", "business analyst"],
  ["ผู้จัดการโครงการ", "program manager"],
  ["นักการตลาด", "marketing manager"],
  ["การตลาดดิจิทัล", "marketing manager"],
  ["ผู้จัดการการเติบโต", "marketing manager"],
  ["ที่ปรึกษากฎหมาย", "legal counsel"],
  ["ทนายความ", "legal counsel"],
  ["ผู้จัดการกำกับดูแล", "compliance manager"],
  ["ที่ปรึกษาด้านข้อมูลส่วนบุคคล", "privacy counsel"],
  ["ผู้จัดการฝ่ายปฏิบัติการ", "operations manager"],
  ["นักวิเคราะห์กลยุทธ์", "strategy analyst"],
];

export const TECH_ROLES: Record<string, string[]> = {
  "software engineer": [
    "software engineer",
    "software developer",
    "SWE",
    "SDE",
    "member of technical staff",
    "backend engineer",
    "full stack engineer",
  ],
  "backend engineer": [
    "backend engineer",
    "software engineer backend",
    "platform engineer",
    "server-side engineer",
  ],
  "frontend engineer": [
    "frontend engineer",
    "front-end engineer",
    "UI engineer",
    "web engineer",
  ],
  "full stack engineer": [
    "full stack engineer",
    "full-stack engineer",
    "software engineer",
  ],
  "devops engineer": [
    "devops engineer",
    "site reliability engineer",
    "SRE",
    "infrastructure engineer",
    "platform engineer",
  ],
  "data engineer": [
    "data engineer",
    "analytics engineer",
    "ETL engineer",
    "data platform engineer",
  ],
  "data scientist": [
    "data scientist",
    "applied scientist",
    "machine learning scientist",
    "research scientist",
    "decision scientist",
  ],
  "machine learning engineer": [
    "machine learning engineer",
    "ML engineer",
    "AI engineer",
    "applied AI engineer",
  ],
  "security engineer": [
    "security engineer",
    "application security engineer",
    "product security engineer",
    "cloud security engineer",
  ],
  "mobile engineer": [
    "ios engineer",
    "android engineer",
    "mobile engineer",
    "mobile software engineer",
  ],
};

export const BUSINESS_ROLES: Record<string, string[]> = {
  "product manager": [
    "product manager",
    "PM",
    "product owner",
    "group product manager",
    "associate product manager",
    "APM",
    "junior product manager",
  ],
  "business analyst": [
    "business analyst",
    "strategy analyst",
    "operations analyst",
    "business operations analyst",
  ],
  "operations manager": [
    "operations manager",
    "business operations manager",
    "operations lead",
    "operations associate",
    "business operations associate",
  ],
  "program manager": [
    "program manager",
    "technical program manager",
    "TPM",
  ],
  "customer success": [
    "customer success manager",
    "customer success",
    "client success manager",
    "account manager",
  ],
  "sales operations": [
    "sales operations",
    "revenue operations",
    "revops",
    "sales strategy",
  ],
  "business development": [
    "business development",
    "partnerships manager",
    "strategic partnerships",
    "partnerships",
  ],
};

export const LEGAL_COMPLIANCE_ROLES: Record<string, string[]> = {
  "privacy counsel": [
    "privacy counsel",
    "data protection counsel",
    "privacy attorney",
    "information security counsel",
    "product counsel privacy",
    "privacy compliance manager",
  ],
  "legal counsel": [
    "legal counsel",
    "corporate counsel",
    "commercial counsel",
    "in-house counsel",
  ],
  "regulatory counsel": [
    "regulatory counsel",
    "compliance counsel",
    "product counsel regulatory",
  ],
  "compliance manager": [
    "compliance manager",
    "compliance officer",
    "ethics and compliance manager",
    "regulatory compliance manager",
    "privacy compliance manager",
  ],
  "risk and compliance analyst": [
    "risk analyst",
    "compliance analyst",
    "risk and compliance analyst",
  ],
  "legal operations": [
    "legal operations manager",
    "legal operations",
    "contract manager",
    "contract specialist",
  ],
  "employment counsel": [
    "employment counsel",
    "labor and employment counsel",
    "employment attorney",
  ],
  "tech policy analyst": [
    "tech policy analyst",
    "technology policy analyst",
    "policy analyst",
    "AI policy analyst",
    "digital policy analyst",
  ],
  "ai governance": [
    "AI governance",
    "responsible AI",
    "AI policy",
    "responsible AI manager",
    "AI governance analyst",
  ],
};

export const DATA_ANALYTICS_ROLES: Record<string, string[]> = {
  "data analyst": [
    "data analyst",
    "business intelligence analyst",
    "BI analyst",
    "analytics analyst",
  ],
  "analytics engineer": [
    "analytics engineer",
    "data engineer analytics",
    "BI engineer",
  ],
  "business intelligence": [
    "business intelligence analyst",
    "BI developer",
    "BI engineer",
  ],
  "machine learning engineer": [
    "machine learning engineer",
    "ML engineer",
    "AI engineer",
  ],
  "data scientist": [
    "data scientist",
    "decision scientist",
    "applied scientist",
  ],
};

export const MARKETING_GROWTH_ROLES: Record<string, string[]> = {
  "marketing manager": [
    "marketing manager",
    "growth marketing manager",
    "digital marketing manager",
    "growth lead",
  ],
  "product marketing": [
    "product marketing manager",
    "PMM",
    "go-to-market manager",
  ],
  "content marketing": [
    "content marketing manager",
    "content strategist",
    "SEO content manager",
  ],
  "demand generation": [
    "demand generation manager",
    "lifecycle marketing manager",
    "growth marketing",
  ],
  "brand marketing": [
    "brand marketing manager",
    "brand strategist",
  ],
};

export const OPERATIONS_STRATEGY_ROLES: Record<string, string[]> = {
  "strategy analyst": [
    "strategy analyst",
    "corporate strategy analyst",
    "strategic finance analyst",
  ],
  "chief of staff": [
    "chief of staff",
    "business operations",
    "strategic operations",
  ],
  "operations manager": [
    "operations manager",
    "business operations manager",
    "operations lead",
    "operations associate",
    "business operations associate",
  ],
  "partnerships manager": [
    "partnerships manager",
    "strategic partnerships",
    "BD manager",
  ],
  "program manager": [
    "program manager",
    "operations program manager",
  ],
};

export const ROLE_CATEGORY_MAP: Record<RoleCategory, Record<string, string[]> | null> = {
  tech: TECH_ROLES,
  business: BUSINESS_ROLES,
  legal_compliance: LEGAL_COMPLIANCE_ROLES,
  data_analytics: DATA_ANALYTICS_ROLES,
  marketing_growth: MARKETING_GROWTH_ROLES,
  operations_strategy: OPERATIONS_STRATEGY_ROLES,
  general: {},
};

export const BROADER_ADDITIONS: Record<string, string[]> = {
  "privacy counsel": ["compliance counsel", "regulatory counsel"],
  "legal counsel": ["corporate counsel", "commercial counsel"],
  "tech policy analyst": ["policy analyst", "AI policy analyst", "digital policy analyst"],
  "ai governance": ["AI policy analyst", "technology policy analyst", "policy analyst", "responsible AI"],
  "software engineer": ["backend engineer", "full stack engineer"],
  "product manager": ["program manager", "product owner"],
  "data scientist": ["machine learning engineer", "analytics engineer"],
  "machine learning engineer": ["data scientist", "AI engineer"],
};

