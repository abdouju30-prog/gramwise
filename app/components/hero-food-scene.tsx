"use client";

import Image from "next/image";

type Props = { className?: string };

export function HeroFoodScene({ className = "" }: Props) {
  return (
    <div className={`hero-food-scene ${className}`.trim()} aria-hidden="true">
      {/* Baguette — large, diagonal, background layer */}
      <div className="hero-food-baguette">
        <Image
          src="/hero-baguette.png"
          alt=""
          width={1344}
          height={896}
          className="hero-food-baguette-img"
          priority
          draggable={false}
          quality={90}
        />
      </div>

    </div>
  );
}
