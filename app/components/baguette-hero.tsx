"use client";

import Image from "next/image";

type Props = { className?: string };

export function BaguetteHero({ className = "" }: Props) {
  return (
    <div className={`baguette-wrap ${className}`.trim()} aria-hidden="true">
      <Image
        src="/hero-baguette.png"
        alt=""
        width={1344}
        height={896}
        className="baguette-img"
        priority
        draggable={false}
        quality={90}
      />
    </div>
  );
}
