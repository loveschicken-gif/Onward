"use client";

import type { OpportunitySignal as Signal } from "@/lib/opportunitySignals";

type OpportunitySignalsProps = {
  signals: Signal[];
};

const CONFIDENCE_LABEL: Record<Signal["confidence"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function OpportunitySignals({ signals }: OpportunitySignalsProps) {
  if (!signals || signals.length === 0) return null;

  return (
    <section
      className="opportunity-signals"
      aria-labelledby="opportunity-signals-heading"
    >
      <h2 id="opportunity-signals-heading" className="opportunity-signals-title">
        Opportunity Signals
      </h2>
      <p className="opportunity-signals-subtitle">
        Hints based on your search strategy.
      </p>
      <ul className="opportunity-signals-list">
        {signals.map((signal) => (
          <li key={signal.id} className="opportunity-signal-item">
            <div className="opportunity-signal-content">
              <span className="opportunity-signal-title">{signal.title}</span>
              <p className="opportunity-signal-description">
                {signal.description}
              </p>
            </div>
            <span
              className="opportunity-signal-confidence"
              aria-label={`Confidence: ${CONFIDENCE_LABEL[signal.confidence]}`}
            >
              {CONFIDENCE_LABEL[signal.confidence]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
