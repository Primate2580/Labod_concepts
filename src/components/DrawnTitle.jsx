import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Hero title that is "drawn" letter by letter like ink on drafting paper:
// each letter's outline traces itself, then fills in. Runs on every page load.
// Drawn as SVG and measured after the font loads, so it always fits the screen.
const STEP = 0.16; // seconds between the start of each letter
const PAD = 12;    // breathing room around the text (SVG units)

export default function DrawnTitle({ title, location }) {
  const svgRef = useRef(null);
  const [fontReady, setFontReady] = useState(false);
  const [box, setBox] = useState(null); // measured viewBox; animation starts once set

  // Wait for the display font so measuring and drawing use the real letter shapes
  useEffect(() => {
    let alive = true;
    const go = () => alive && setFontReady(true);
    const timer = setTimeout(go, 1500); // never wait longer than this
    (document.fonts ? document.fonts.load("800 100px Syne") : Promise.resolve()).then(go, go);
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  // Measure the real text size, then fit the viewBox to it
  useLayoutEffect(() => {
    if (!fontReady || !svgRef.current) return;
    const b = svgRef.current.getBBox();
    setBox(`${b.x - PAD} ${b.y - PAD} ${b.width + PAD * 2} ${b.height + PAD * 2}`);
  }, [fontReady]);

  // Split the title over two lines, e.g. "LABOD" / "CONCEPTS"
  const words = title.toUpperCase().split(" ");
  const cut = words.length > 1 ? Math.ceil(words.length / 2) : 1;
  const lines = [words.slice(0, cut).join(" "), words.slice(cut).join(" ")].filter(Boolean);

  const W = 700;
  const H = 85 + (lines.length - 1) * 100 + 15;
  const go = box !== null;

  let n = 0; // running letter count, drives the delay of each letter
  const rendered = lines.map((line, li) => (
    <text key={li} x={W / 2} y={85 + li * 100} textAnchor="middle" fill="transparent"
      fontFamily="Syne, sans-serif" fontWeight="800" fontSize="100" letterSpacing="-1">
      {[...line].map((ch, ci) => {
        const delay = n++ * STEP;
        return ch === " " ? (
          <tspan key={ci}> </tspan>
        ) : (
          <tspan key={ci} className={go ? "draw-letter" : ""} style={{ "--d": `${delay}s` }}>{ch}</tspan>
        );
      })}
    </text>
  ));

  return (
    <>
      <h1>
        <span className="sr-only">{title}</span>
        <svg ref={svgRef} viewBox={box || `0 0 ${W} ${H}`} aria-hidden="true"
          className="mx-auto block max-h-[38svh] w-[min(88vw,980px)] overflow-visible">
          {rendered}
        </svg>
      </h1>
      <p className={`mt-5 text-base text-white/90 opacity-0 ${go ? "fade-up" : ""}`}
        style={{ animationDelay: `${n * STEP + 1}s` }}>
        {location}
      </p>
    </>
  );
}
