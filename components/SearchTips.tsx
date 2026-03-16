"use client";

import { searchTips, searchTipsNote } from "@/content/searchTipsUI";

export default function SearchTips() {
  return (
    <div className="search-tips" role="region" aria-label="Search tips">
      <h3 className="search-tips-title">Search Tips</h3>
      <ul className="search-tips-list">
        {searchTips.map((tip, i) => (
          <li key={i} className="search-tips-item">
            <span className="search-tips-label">{tip.title}</span>
            <span className="search-tips-example">e.g. {tip.example}</span>
          </li>
        ))}
      </ul>
      <p className="search-tips-note">
        {searchTipsNote}
      </p>
    </div>
  );
}
