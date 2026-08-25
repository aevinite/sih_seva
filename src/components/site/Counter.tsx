"use client";
import { useEffect, useRef, useState } from "react";

/** Count-up number on scroll (replaces main.js initCounters). */
export default function Counter({
  to,
  suffix = "",
  decimals = 0,
  className = "tnum",
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          const steps = 48;
          const inc = to / steps;
          let cur = 0;
          const tick = () => {
            cur += inc;
            if (cur >= to) cur = to;
            setVal(cur);
            if (cur < to) requestAnimationFrame(tick);
          };
          tick();
          io.unobserve(e.target);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  const text = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-IN");
  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}
