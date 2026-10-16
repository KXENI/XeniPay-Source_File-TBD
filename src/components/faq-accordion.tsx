"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/site";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return <div className="faq-list">
    {faqs.map((item, index) => <details key={item.question} open={openIndex === index}>
      <summary onClick={event => {
        event.preventDefault();
        setOpenIndex(current => current === index ? null : index);
      }}>{item.question}<Plus size={18} aria-hidden="true"/></summary>
      <p>{item.answer}</p>
    </details>)}
  </div>;
}
