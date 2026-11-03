import { useEffect, useRef } from "react";

// Gallery for one project group: arrows, keyboard, swipe, counter, Esc.
export default function Lightbox({ project, index, setIndex, onClose }) {
  const { images, title } = project;
  const total = images.length;
  const touchX = useRef(null);
  const closeBtn = useRef(null);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [total, onClose, setIndex]);

  const btn = "absolute top-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/10 p-3 backdrop-blur-md hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow";

  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} gallery`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
      }}>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-sm">
        <span>{title} &nbsp; {index + 1} / {total}</span>
        <button ref={closeBtn} onClick={onClose} aria-label="Close gallery"
          className="rounded-full border border-white/70 px-4 py-2 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow">Close</button>
      </div>
      <img src={images[index]} alt={`${title}, photo ${index + 1} of ${total}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[78vh] max-w-[92vw] object-contain" />
      {total > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous photo" className={`${btn} left-4`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next photo" className={`${btn} right-4`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
