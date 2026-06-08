"use client";

import { useEffect, useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  max?: number;
  perspective?: number;
}

export function TiltCard({ children, className, style, max = 6, perspective = 900 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    import("vanilla-tilt").then(({ default: VanillaTilt }) => {
      if (!ref.current) return;
      VanillaTilt.init(ref.current, {
        max,
        speed: 500,
        glare: true,
        "max-glare": 0.12,
        perspective,
        scale: 1.02,
        easing: "cubic-bezier(.03,.98,.52,.99)",
      });
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ref.current as any)?.vanillaTilt?.destroy();
    };
  }, [max, perspective]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
