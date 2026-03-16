"use client";

import { FormEvent } from "react";

const PLACEHOLDERS = [
  "Enter a role, title, or search query.",
  "software engineer berlin",
  "privacy counsel london remote",
  "entry level product manager singapore",
  "data analyst toronto",
  "legal counsel dubai",
  "SRE remote",
  "AI engineer visa australia",
  "business operations associate bangkok",
  "marketing manager mexico city",
  "compliance manager fintech hong kong",
  "วิศวกรซอฟต์แวร์ กรุงเทพ",
];

type SearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholderIndex?: number;
};

export default function SearchForm({
  value,
  onChange,
  onSubmit,
  placeholderIndex = 0,
}: SearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[Math.min(placeholderIndex, PLACEHOLDERS.length - 1)]}
          className="search-input"
          aria-label="Job search query"
          autoFocus
        />
        <button type="submit" className="submit-btn">
          Build search plan
        </button>
      </div>
    </form>
  );
}
