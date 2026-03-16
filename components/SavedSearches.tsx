"use client";

import { useState, useCallback, useEffect } from "react";
import type { UserControls } from "@/lib/jobQueryEngine";

const SAVED_KEY = "hicup_saved";
const SAVED_MAX = 5;

export type SavedEntry = { query: string; controls: UserControls };

function loadSaved(): SavedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, SAVED_MAX).filter(
      (e): e is SavedEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as SavedEntry).query === "string" &&
        typeof (e as SavedEntry).controls === "object"
    );
  } catch {
    return [];
  }
}

function saveSaved(entries: SavedEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(entries.slice(0, SAVED_MAX)));
  } catch {
    // ignore
  }
}

type SavedSearchesProps = {
  currentQuery: string;
  currentControls: UserControls;
  shareUrl: string;
  onLoadSaved: (entry: SavedEntry) => void;
};

export default function SavedSearches({
  currentQuery,
  currentControls,
  shareUrl,
  onLoadSaved,
}: SavedSearchesProps) {
  const [saved, setSaved] = useState<SavedEntry[]>([]);
  const [copyLinkFeedback, setCopyLinkFeedback] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const handleSaveSearch = useCallback(() => {
    const q = currentQuery.trim();
    if (!q) return;
    const entry: SavedEntry = { query: q, controls: { ...currentControls } };
    const next = [
      entry,
      ...saved.filter((e) => e.query !== entry.query),
    ].slice(0, SAVED_MAX);
    saveSaved(next);
    setSaved(next);
  }, [currentQuery, currentControls, saved]);

  const handleCopyShareLink = useCallback(async () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareUrl}`
        : shareUrl;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopyLinkFeedback(true);
      setTimeout(() => setCopyLinkFeedback(false), 2000);
    } catch {
      // ignore
    }
  }, [shareUrl]);

  const handleShareLink = useCallback(() => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareUrl}`
        : shareUrl;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", fullUrl);
    }
  }, [shareUrl]);

  const handleLoad = useCallback(
    (entry: SavedEntry) => {
      onLoadSaved(entry);
    },
    [onLoadSaved]
  );

  return (
    <section className="saved-searches" aria-label="Saved and share">
      <h2 className="saved-searches-title">Saved / Recent</h2>
      <div className="saved-searches-actions">
        <button
          type="button"
          onClick={handleSaveSearch}
          className="card-btn"
        >
          Save Search
        </button>
        <button
          type="button"
          onClick={handleShareLink}
          className="card-btn"
        >
          Share Link
        </button>
        <button
          type="button"
          onClick={handleCopyShareLink}
          className="card-btn card-btn-copy"
        >
          {copyLinkFeedback ? "Copied" : "Copy share link"}
        </button>
      </div>
      {saved.length > 0 && (
        <div className="saved-searches-list">
          <span className="saved-searches-label">Saved searches:</span>
          {saved.map((entry, idx) => (
            <button
              key={`${entry.query}-${idx}`}
              type="button"
              className="saved-chip"
              onClick={() => handleLoad(entry)}
            >
              {entry.query}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
