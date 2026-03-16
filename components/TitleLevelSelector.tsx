"use client";

import type { TitleLevel, UserControls } from "@/lib/jobQueryEngine";

type TitleLevelSelectorProps = {
  controls: UserControls;
  onChange: (controls: UserControls) => void;
};

const OPTIONS: { value: TitleLevel; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "junior_associate", label: "Junior / Associate" },
  { value: "senior", label: "Senior" },
  { value: "lead_principal", label: "Lead / Principal" },
  { value: "manager", label: "Manager" },
  { value: "director_plus", label: "Director+" },
];

export default function TitleLevelSelector({
  controls,
  onChange,
}: TitleLevelSelectorProps) {
  const handleChange = (value: TitleLevel) => {
    onChange({
      ...controls,
      titleLevel: value,
    });
  };

  const selected = controls.titleLevel ?? "any";

  return (
    <div className="title-level-selector" aria-label="Title preference">
      <label className="title-level-label">
        Title preference
        <select
          className="title-level-select"
          value={selected}
          onChange={(e) => handleChange(e.target.value as TitleLevel)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <p className="title-level-note">
        Choose how broad or specific you want job-title wording to be.
        This only changes search wording. It does not determine eligibility or sponsorship.
      </p>
    </div>
  );
}

