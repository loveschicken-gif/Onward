"use client";

import type { UserControls } from "@/lib/jobQueryEngine";

type FilterChipsProps = {
  controls: UserControls;
  onChange: (controls: UserControls) => void;
};

const CHIPS: { key: keyof Omit<UserControls, "languageMode" | "titleLevel">; label: string }[] = [
  { key: "visaMode", label: "Work-authorization-related keywords" },
  { key: "remoteMode", label: "Remote" },
  { key: "entryLevelMode", label: "Entry Level" },
  { key: "startupMode", label: "Startup" },
  { key: "enterpriseMode", label: "Enterprise" },
  { key: "freshMode", label: "Fresh Jobs" },
  { key: "internationalMode", label: "International Candidate Mode" },
];

export default function FilterChips({ controls, onChange }: FilterChipsProps) {
  const toggle = (key: keyof UserControls) => {
    onChange({
      ...controls,
      [key]: !controls[key],
    });
  };

  return (
    <>
      <div className="filter-chips" role="group" aria-label="Search filters">
        {CHIPS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`chip ${controls[key] ? "chip-active" : ""}`}
            onClick={() => toggle(key)}
            aria-pressed={controls[key]}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="filter-note">
        International Candidate Mode and work-authorization-related filters use sponsorship-related
        search patterns. They do not confirm sponsorship or legal eligibility.
      </p>
    </>
  );
}
