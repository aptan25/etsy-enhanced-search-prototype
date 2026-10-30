"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      <ul className="flex flex-col gap-2">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative block h-16 w-16 overflow-hidden rounded-md ${i === active ? "ring-2 ring-neutral-900" : "opacity-80 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-xl bg-neutral-100">
        <Image src={images[active]} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain" />
      </div>
    </div>
  );
}
