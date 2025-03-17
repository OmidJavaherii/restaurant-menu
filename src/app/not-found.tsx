"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function NotFound() {
  const router = useRouter();
  const textRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const copyContainer = textRef.current;
    const handle = handleRef.current;

    if (!copyContainer || !handle) return;

    // Wrap each character in a span
    const textContent = copyContainer.textContent || "";
    copyContainer.innerHTML = textContent
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    const chars = copyContainer.querySelectorAll("span");
    gsap.set(chars, { autoAlpha: 0 });

    const mainTimeline = gsap.timeline();

    const firstChar = chars[0];
    const charWidth = firstChar ? firstChar.offsetWidth : 0;

    // Animate text
    mainTimeline.to(chars, {
      duration: 0.05,
      autoAlpha: 1,
      stagger: 0.05,
      ease: "back.inOut(1.7)",
    });

    mainTimeline.to(
      handle,
      {
        duration: (chars.length * 0.05 + 0.05 * chars.length)*0.7,
        x: copyContainer.offsetWidth + charWidth,
        ease: "leaner", 
      },
      0 
    );

  // Blink handle
  const handleTL = gsap.timeline();
  handleTL.fromTo(
    handle,
    { autoAlpha: 0 },
    {
      duration: 0.4,
      autoAlpha: 1,
      repeat: -1,
      yoyo: true,
    }
  );

    // Cleanup
    return () => {
      mainTimeline.kill();
      mainTimeline.kill();
    };
  }, [mounted]);

  return (
    <div className="not-found-page w-full h-screen flex flex-col justify-around items-center bg-dark-secondary">
      <div className=" flex flex-row justify-center items-center bg-dark-secondary">
          <span className="handle" ref={handleRef}></span>
          <p className="text-12 not-found-text" ref={textRef}>404, page not found...</p>
      </div>
        <button className="homeButton p-4 rounded" onClick={() => router.push("/")}>
          Back to Home
        </button>
    </div>
  );
}
