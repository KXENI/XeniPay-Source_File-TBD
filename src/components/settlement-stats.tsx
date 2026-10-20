"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Wallets", value: 1349248.29 },
  { label: "Booking amount", value: 4850.90 },
  { label: "Supply", value: 238521.10 },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SettlementStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let hasStarted = false;
    const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const requestFrame = window.requestAnimationFrame?.bind(window) ?? ((callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16));
    const cancelFrame = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window);

    const startCounter = () => {
      if (hasStarted) return;
      hasStarted = true;
      section.dataset.active = "true";

      if (reducedMotion) {
        setProgress(1);
        return;
      }

      const startedAt = performance.now();
      const duration = 2800;
      const tick = (now: number) => {
        const elapsed = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        setProgress(eased);
        if (elapsed < 1) animationFrame.current = requestFrame(tick);
      };
      animationFrame.current = requestFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      startCounter();
      return () => {
        if (animationFrame.current !== null) cancelFrame(animationFrame.current);
      };
    }

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        startCounter();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (animationFrame.current !== null) cancelFrame(animationFrame.current);
    };
  }, []);

  return <section ref={sectionRef} className="settlement-stats-section shell" aria-label="Live XeniPay settlement activity">
    <div className="settlement-stats-card">
      {stats.map(stat => <div className="settlement-stat" key={stat.label} aria-label={`${stat.label}: ${numberFormatter.format(stat.value)}`}>
        <span>{stat.label}</span>
        <strong aria-hidden="true">{numberFormatter.format(stat.value * progress)}</strong>
      </div>)}
      <div className="settlement-live-pill"><span aria-hidden="true"/>Live data</div>
    </div>
  </section>;
}
