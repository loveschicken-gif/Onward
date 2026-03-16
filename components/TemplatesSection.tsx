"use client";

import { useState, useCallback } from "react";
import type { ProTemplate } from "@/lib/jobQueryEngine";
import { proTemplateMetaByLabel } from "@/content/templates";

type TemplatesSectionProps = {
  templates: ProTemplate[];
  onOpenGoogle?: () => void;
};

function CopyButton({
  text,
  label,
  buttonText = "Copy query",
}: {
  text: string;
  label: string;
  buttonText?: string;
}) {
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
      className="card-btn card-btn-copy card-btn-sm"
      title={`Copy: ${label}`}
      data-copied={copied ? "true" : undefined}
      aria-live="polite"
    >
      {copied ? "Copied" : buttonText}
    </button>
  );
}

export default function TemplatesSection({ templates, onOpenGoogle }: TemplatesSectionProps) {
  if (templates.length === 0) return null;
  return (
    <section className="templates-section" aria-label="Pro search templates">
      <h2 className="templates-section-title">Pro search templates</h2>
      <div className="templates-grid">
        {templates.map((tpl, i) => (
          <div key={i} className="template-card">
            <h3 className="template-card-label">{tpl.label}</h3>
            {proTemplateMetaByLabel[tpl.label] && (
              <p className="template-card-description">
                {proTemplateMetaByLabel[tpl.label].description}
              </p>
            )}
            <div className="template-card-actions">
              {tpl.googleUrls[0] && (
                <a
                  href={tpl.googleUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-btn card-btn-google"
                  onClick={onOpenGoogle}
                >
                  Open in Google
                </a>
              )}
              <CopyButton
                text={tpl.queries.join("\n")}
                label={`Copy all: ${tpl.label}`}
                buttonText="Copy all"
              />
            </div>
            <ul className="template-query-list">
              {tpl.queries.slice(0, 3).map((q, j) => (
                <li key={j} className="template-query-item">
                  <code className="query-text query-text-sm">{q}</code>
                  <div className="query-actions">
                    <CopyButton text={q} label={q} />
                    {tpl.googleUrls[j] != null && (
                      <a
                        href={tpl.googleUrls[j]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-btn card-btn-google card-btn-sm"
                        onClick={onOpenGoogle}
                      >
                        Open in Google
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {tpl.queries.length > 3 && (
              <p className="template-more">+{tpl.queries.length - 3} more queries</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
