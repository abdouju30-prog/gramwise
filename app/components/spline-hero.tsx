"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(
  () => import("@splinetool/react-spline/next"),
  {
    ssr: false,
    loading: () => <div className="spline-skeleton" aria-hidden="true" />,
  },
);

const SCENE =
  process.env.NEXT_PUBLIC_SPLINE_SCENE ||
  "https://prod.spline.design/9951u9cumiw2Ehj8/scene.splinecode";

type SplineHeroProps = {
  className?: string;
  onError?: () => void;
};

export function SplineHero({
  className = "",
  onError,
}: SplineHeroProps) {
  const [error, setError] = useState(false);

  if (error) {
    return null;
  }

  return (
    <div className={`spline-wrap ${className}`.trim()} aria-hidden="true">
      <Spline
        scene={SCENE}
        onError={() => {
          setError(true);
          onError?.();
        }}
      />
    </div>
  );
}
