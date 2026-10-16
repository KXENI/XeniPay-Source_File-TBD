"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    return () => { delete document.documentElement.dataset.motion; };
  }, [paused]);
  return <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>
    {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}{paused ? "Resume ambient motion" : "Pause ambient motion"}
  </button>;
}
