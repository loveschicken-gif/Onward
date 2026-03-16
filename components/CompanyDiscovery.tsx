"use client";

import { useState, useCallback } from "react";
import { buildGoogleUrl } from "@/lib/jobQueryEngine";

type CompanyDiscoveryProps = {
  queries: string[];
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
      // ignore
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

export default function CompanyDiscovery({ queries, onOpenGoogle }: CompanyDiscoveryProps) {
  if (queries.length === 0) return null;
  return (
    <section className="company-discovery" aria-label="Discover hiring companies">
      <h2 className="company-discovery-title">Discover Hiring Companies</h2>
      <ul className="company-discovery-list">
        {queries.map((query, i) => (
          <li key={i} className="company-discovery-item">
            <code className="query-text">{query}</code>
            <div className="query-actions">
              <CopyButton text={query} label={query} />
              <a
                href={buildGoogleUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn card-btn-google"
                onClick={onOpenGoogle}
              >
                Open in Google
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
