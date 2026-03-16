"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  generateJobSearchPlan,
  getTopSearchUrls,
  openTopSearches,
  DEFAULT_USER_CONTROLS,
  type JobSearchPlan,
  type UserControls,
  type TitleLevel,
} from "@/lib/jobQueryEngine";
import SearchForm from "@/components/SearchForm";
import QueryPackCard from "@/components/QueryPackCard";
import FilterChips from "@/components/FilterChips";
import TitleLevelSelector from "@/components/TitleLevelSelector";
import DetectedSummary from "@/components/DetectedSummary";
import SearchTips from "@/components/SearchTips";
import SimilarRoles from "@/components/SimilarRoles";
import CompanyDiscovery from "@/components/CompanyDiscovery";
import OpportunitySignals from "@/components/OpportunitySignals";
import TemplatesSection from "@/components/TemplatesSection";
import SavedSearches, { type SavedEntry } from "@/components/SavedSearches";
import FAQ from "@/components/FAQ";

const HISTORY_KEY = "hicup_last_searches";
const HISTORY_MAX = 5;

type HistoryEntry = { query: string; controls: UserControls };

function parseControlsFromSearchParams(params: URLSearchParams): UserControls {
  const titleLevelParam = params.get("titleLevel") as TitleLevel | null;
  const allowedTitleLevels: TitleLevel[] = [
    "any",
    "junior_associate",
    "senior",
    "lead_principal",
    "manager",
    "director_plus",
  ];
  const safeTitleLevel =
    titleLevelParam && allowedTitleLevels.includes(titleLevelParam)
      ? titleLevelParam
      : "any";
  return {
    visaMode: params.get("visa") === "1",
    remoteMode: params.get("remote") === "1",
    entryLevelMode: params.get("entryLevel") === "1",
    startupMode: params.get("startup") === "1",
    enterpriseMode: params.get("enterprise") === "1",
    freshMode: params.get("fresh") === "1",
    internationalMode: params.get("international") === "1",
    titleLevel: safeTitleLevel,
  };
}

function StartMySearchButton({
  packs,
  modifiers,
  onOpen,
}: {
  packs: JobSearchPlan["packs"];
  modifiers: string[];
  onOpen: () => void;
}) {
  const urls = useMemo(() => getTopSearchUrls(packs, modifiers), [packs, modifiers]);
  const handleClick = useCallback(() => {
    onOpen();
    openTopSearches(urls);
  }, [urls, onOpen]);
  if (urls.length === 0) return null;
  return (
    <div className="start-search-wrap">
      <button
        type="button"
        onClick={handleClick}
        className="start-search-btn"
      >
        Build search plan
      </button>
      <p className="start-search-helper">
        Opens the best search URLs in new tabs so you can move forward faster.
      </p>
    </div>
  );
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, HISTORY_MAX).filter(
      (e): e is HistoryEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as HistoryEntry).query === "string" &&
        typeof (e as HistoryEntry).controls === "object"
    );
  } catch {
    return [];
  }
}

function saveHistory(query: string, controls: UserControls) {
  if (typeof window === "undefined" || !query.trim()) return;
  const entry: HistoryEntry = { query: query.trim(), controls: { ...controls } };
  const prev = loadHistory();
  const next = [
    entry,
    ...prev.filter((e) => e.query !== entry.query),
  ].slice(0, HISTORY_MAX);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [controls, setControls] = useState<UserControls>(DEFAULT_USER_CONTROLS);
  const [plan, setPlan] = useState<JobSearchPlan | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchCount, setSearchCount] = useState<number | null>(null);
  const [openCount, setOpenCount] = useState<number | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showRefine, setShowRefine] = useState(false);

  // Hydrate from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim();
    if (q) {
      setQuery(q);
      setControls(parseControlsFromSearchParams(params));
      setPlan(generateJobSearchPlan(q, parseControlsFromSearchParams(params)));
    }
  }, []);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Fetch public counters
  useEffect(() => {
    Promise.all([
      fetch("/api/metrics/search").then((r) => r.json()),
      fetch("/api/metrics/open").then((r) => r.json()),
    ]).then(([searchRes, openRes]) => {
      setSearchCount(searchRes.count ?? 0);
      setOpenCount(openRes.count ?? 0);
    }).catch(() => {
      setSearchCount(0);
      setOpenCount(0);
    });
  }, []);

  const trackSearch = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics/search", { method: "POST" });
      const data = await res.json();
      if (typeof data.count === "number") setSearchCount(data.count);
    } catch {
      // ignore
    }
  }, []);

  const trackOpen = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics/open", { method: "POST" });
      const data = await res.json();
      if (typeof data.count === "number") setOpenCount(data.count);
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    saveHistory(q, controls);
    setHistory(loadHistory());
    setIsBuilding(true);
    setPlan(null);
    trackSearch();
    setTimeout(() => {
      setPlan(generateJobSearchPlan(q, controls));
      setIsBuilding(false);
    }, 320);
  }, [query, controls, trackSearch]);

  const applyHistoryEntry = useCallback((entry: HistoryEntry) => {
    setQuery(entry.query);
    setControls(entry.controls);
    setPlan(generateJobSearchPlan(entry.query, entry.controls));
    saveHistory(entry.query, entry.controls);
    setHistory(loadHistory());
  }, []);

  const handleLoadSaved = useCallback((entry: SavedEntry) => {
    setQuery(entry.query);
    const mergedControls = { ...DEFAULT_USER_CONTROLS, ...entry.controls };
    setControls(mergedControls);
    setPlan(generateJobSearchPlan(entry.query, mergedControls));
  }, []);

  const handleSimilarRole = useCallback(
    (role: string) => {
      const roleSource =
        plan?.usedFallbackPhrase && plan?.fallbackPhrase
          ? plan.fallbackPhrase
          : plan?.detectedBaseRoles[0] ?? "";
      const rest = (plan?.normalizedQuery ?? "")
        .replace(roleSource.toLowerCase(), "")
        .replace(/\s+/g, " ")
        .trim();
      const newQuery = rest ? `${role} ${rest}` : role;
      setQuery(newQuery);
      setPlan(generateJobSearchPlan(newQuery, controls));
    },
    [plan, controls]
  );

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-card" role="banner">
          <div className="hero-header">
            <div className="hero-title-mark">
              <span className="hero-title-mark-dot" />
              Job search companion
            </div>
            <h1 className="hero-title">Onvard</h1>
            <p className="hero-subtitle">Turn one idea into a structured search plan.</p>
            <p className="hero-tagline">Simple filters. Stronger Google searches.</p>
          </div>

          <section className="search-section">
            <div className="search-shell">
              <SearchForm
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                placeholderIndex={0}
              />
              <FilterChips controls={controls} onChange={setControls} />
              <button
                type="button"
                className="refine-toggle"
                onClick={() => setShowRefine((prev) => !prev)}
                aria-expanded={showRefine}
              >
                <span>Refine search</span>
                <span className={`refine-toggle-icon ${showRefine ? "open" : ""}`}>⌄</span>
              </button>
              {showRefine && (
                <div className="refine-panel">
                  <TitleLevelSelector controls={controls} onChange={setControls} />
                </div>
              )}
            </div>
            {history.length > 0 && (
              <div className="history">
                <span className="history-label">Recent searches</span>
                {history.map((entry, idx) => (
                  <button
                    key={`${entry.query}-${idx}`}
                    type="button"
                    className="history-chip"
                    onClick={() => applyHistoryEntry(entry)}
                  >
                    {entry.query}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </header>
      <SearchTips />

      {(plan || isBuilding) && (
        <section className="results" aria-busy={isBuilding} aria-live="polite">
          <h2 className="results-title">Search plan</h2>
          <p className="results-disclaimer">Search hints, not legal advice.</p>
          {isBuilding ? (
            <p className="results-loading" role="status">
              Building your search plan…
            </p>
          ) : plan ? (
            <>
          <DetectedSummary
            lines={plan.detectedSummary}
            usedFallbackPhrase={plan.usedFallbackPhrase}
          />
          <StartMySearchButton
            packs={plan.packs}
            modifiers={plan.modifiers}
            onOpen={trackOpen}
          />
          {plan.signals && plan.signals.length > 0 && (
            <OpportunitySignals signals={plan.signals} />
          )}
          <div className="packs">
            {plan.packs.map((pack, i) => (
              <QueryPackCard
                key={i}
                pack={pack}
                onOpenGoogle={trackOpen}
              />
            ))}
          </div>
          <SimilarRoles
            similarRoles={plan.similarRoles}
            onSelectRole={handleSimilarRole}
          />
          <CompanyDiscovery
            queries={plan.companyDiscoveryQueries}
            onOpenGoogle={trackOpen}
          />
          <TemplatesSection
            templates={plan.proTemplates}
            onOpenGoogle={trackOpen}
          />
          <SavedSearches
            currentQuery={query}
            currentControls={controls}
            shareUrl={plan.shareUrl}
            onLoadSaved={handleLoadSaved}
          />
            </>
          ) : null}
        </section>
      )}

      <FAQ />

      {(searchCount !== null || openCount !== null) && (
        <section className="community-stats" aria-label="Community activity">
          <h2 className="community-stats-title">Community activity</h2>
          <p className="community-stats-caption">
            Simple product activity counts — not personal tracking.
          </p>
          <div className="community-stats-grid">
            <div className="community-stat">
              <span className="community-stat-label">Search plans built</span>
              <span className="community-stat-value">{searchCount ?? 0}</span>
            </div>
            <div className="community-stat">
              <span className="community-stat-label">Google searches opened</span>
              <span className="community-stat-value">{openCount ?? 0}</span>
            </div>
          </div>
        </section>
      )}

      <footer className="footer" aria-label="Footer">
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/about" className="footer-link">
            About
          </Link>
        </nav>
        <p className="footer-tagline">
          <strong>Onvard</strong> — Search better. Move forward. No APIs, no database, no tracking.
        </p>
        <p className="footer-credits">
          Contributors: P, Y
        </p>
      </footer>

      <BackToTopButton />
    </main>
  );
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top-button"
      onClick={handleClick}
      aria-label="Back to top"
    >
      ↑ Back to top
    </button>
  );
}
