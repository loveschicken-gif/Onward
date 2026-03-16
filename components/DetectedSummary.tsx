"use client";

type DetectedSummaryProps = {
  lines: string[];
  usedFallbackPhrase?: boolean;
};

export default function DetectedSummary({
  lines,
  usedFallbackPhrase,
}: DetectedSummaryProps) {
  return (
    <div className="detected-summary">
      <ul className="detected-summary-list">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      {usedFallbackPhrase && (
        <p className="detected-fallback-note" role="status">
          We didn&apos;t match a standard role. Using your exact phrase.
        </p>
      )}
    </div>
  );
}
