"use client";

import { useState } from "react";
import { faqItems } from "@/content/faq";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section" aria-label="Frequently Asked Questions">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <ul className="faq-list">
        {faqItems.map((item, i) => (
          <li key={i} className="faq-item">
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              {item.question}
              <span className="faq-chevron" aria-hidden>
                {openIndex === i ? "▼" : "▶"}
              </span>
            </button>
            {openIndex === i && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
