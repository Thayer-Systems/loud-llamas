"use client";

import { useState } from "react";

type FAQ = { q: string; a: string };

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#EBEBEB] max-w-2xl mx-auto w-full">
      {faqs.map((faq, i) => (
        <div key={faq.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full py-6 flex items-center justify-between text-left gap-6 group"
          >
            <span className="font-bold text-[#000000] text-lg leading-snug">{faq.q}</span>
            <span
              className={`text-[#2563EB] text-3xl font-light leading-none shrink-0 transition-transform duration-300 ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-[#6B7280] leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
