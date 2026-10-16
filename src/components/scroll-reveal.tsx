"use client";

import { useEffect } from "react";

/** Progressive enhancement: server HTML stays visible without JavaScript. */
export function ScrollReveal() {
  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll<HTMLElement>(".section-heading, .feature-card, .workflow-grid, .technology-copy, .centered-heading, .cta-section");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -25px 0px" });
    elements.forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-enabled", "reveal-pending");
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
      elements.forEach(element => element.classList.remove("reveal-enabled", "reveal-pending"));
    };
  }, []);
  return null;
}
