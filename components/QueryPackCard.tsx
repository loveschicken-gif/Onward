"use client";

import { useState, useCallback, useMemo } from "react";
import type { QueryPack } from "@/lib/jobQueryEngine";
import { buildGoogleUrl } from "@/lib/jobQueryEngine";

type QueryPackCardProps = {
  pack: QueryPack;
  onOpenGoogle?: () => void;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback or ignore
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="card-btn card-btn-copy"
      title={`Copy: ${label}`}
      data-copied={copied ? "true" : undefined}
      aria-live="polite"
    >
      {copied ? "Copied" : "Copy query"}
    </button>
  );
}

type LevelSectionProps = {
  title: string;
  queries: string[];
  packLabel: string;
  defaultOpen: boolean;
  onOpenGoogle?: () => void;
};

function LevelSection({
  title,
  queries,
  packLabel,
  defaultOpen,
  onOpenGoogle,
}: LevelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const urls = useMemo(
    () => queries.map((q) => buildGoogleUrl(q)),
    [queries]
  );

  if (queries.length === 0) return null;

  return (
    <div className="level-section">
      <button
        type="button"
        className="level-section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="level-section-title">{title}</span>
        <span className="level-section-chevron" aria-hidden>
          {open ? "▼" : "▶"}
        </span>
      </button>
      {open && (
        <ul className="query-list">
          {queries.map((query, i) => (
            <li key={i} className="query-item">
              <code className="query-text">{query}</code>
              <div className="query-actions">
                <CopyButton text={query} label={packLabel} />
                {urls[i] != null && (
                  <a
                    href={urls[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-btn card-btn-google"
                    onClick={onOpenGoogle}
                  >
                    Open in Google
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function QueryPackCard({ pack, onOpenGoogle }: QueryPackCardProps) {
  const [copyAllFeedback, setCopyAllFeedback] = useState(false);
  const allQueries = useMemo(
    () => [
      ...pack.level1Queries,
      ...pack.level2Queries,
      ...pack.level3Queries,
    ],
    [pack]
  );

  const handleCopyAll = useCallback(async () => {
    const all = allQueries.join("\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopyAllFeedback(true);
      setTimeout(() => setCopyAllFeedback(false), 2000);
    } catch {
      // ignore
    }
  }, [allQueries]);

  const handleOpenTop3 = useCallback(() => {
    onOpenGoogle?.();
    const urls = pack.googleUrls.slice(0, 3);
    urls.forEach((url) => window.open(url, "_blank", "noopener,noreferrer"));
  }, [pack.googleUrls, onOpenGoogle]);

  const hasNarrowLevel1 =
    pack.level1Queries.length > 0 && pack.level1Queries.length <= 2;
  const canOpenTop3 = pack.googleUrls.length >= 1;
  const defaultExpandL2 = hasNarrowLevel1 && pack.level2Queries.length > 0;
  const defaultExpandL3 =
    hasNarrowLevel1 && pack.level2Queries.length === 0 && pack.level3Queries.length > 0;

  const primaryQuery =
    pack.level1Queries[0] ??
    pack.level2Queries[0] ??
    pack.level3Queries[0];
  const primaryUrl = pack.googleUrls[0];

  return (
    <section className="query-pack-card">
      <h3 className="pack-label">{pack.label}</h3>
      <p className="pack-description">{pack.description}</p>
      {hasNarrowLevel1 && (pack.level2Queries.length > 0 || pack.level3Queries.length > 0) && (
        <p className="pack-try-broader" role="status">
          Try broader searches below.
        </p>
      )}
      {primaryQuery && (
        <div className="pack-primary-query">
          <code className="query-text">{primaryQuery}</code>
          <div className="query-actions">
            <CopyButton text={primaryQuery} label={pack.label} />
            {primaryUrl && (
              <a
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn card-btn-google"
                onClick={onOpenGoogle}
              >
                Open in Google
              </a>
            )}
          </div>
        </div>
      )}
      <div className="pack-actions">
        <button
          type="button"
          onClick={handleCopyAll}
          className="card-btn card-btn-copy"
          data-copied={copyAllFeedback ? "true" : undefined}
          aria-live="polite"
        >
          {copyAllFeedback ? "Copied" : "Copy all"}
        </button>
        {canOpenTop3 && (
          <button
            type="button"
            onClick={handleOpenTop3}
            className="card-btn card-btn-google"
          >
            Open Best 3 in This Pack
          </button>
        )}
      </div>
      <LevelSection
        title="Exact Search"
        queries={pack.level1Queries}
        packLabel={pack.label}
        defaultOpen={false}
        onOpenGoogle={onOpenGoogle}
      />
      <LevelSection
        title="Expanded Search"
        queries={pack.level2Queries}
        packLabel={pack.label}
        defaultOpen={defaultExpandL2}
        onOpenGoogle={onOpenGoogle}
      />
      <LevelSection
        title="Broad Search"
        queries={pack.level3Queries}
        packLabel={pack.label}
        defaultOpen={defaultExpandL3}
        onOpenGoogle={onOpenGoogle}
      />
      {pack.recencyUrls && pack.recencyUrls.length > 0 && (
        <div className="recency-section">
          <span className="recency-label">Recency:</span>
          {pack.recencyUrls.map((rec, j) => (
            <div key={j} className="recency-row">
              <span className="recency-title">{rec.label}</span>
              <div className="recency-links">
                {rec.urls.map((url, k) => (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-btn card-btn-google card-btn-sm"
                  >
                    Search {k + 1}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
