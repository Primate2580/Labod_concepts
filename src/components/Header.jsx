import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MenuOverlay from "./MenuOverlay.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-12 md:py-5">
        {/* Toggle: hamburger becomes a close icon */}
        <button
          data-trap
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative h-8 w-8 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
        >
          <span className={`absolute left-0 h-px w-8 bg-current transition-all duration-300 ${open ? "top-4 rotate-45" : "top-2"}`} />
          <span className={`absolute left-0 top-4 h-px w-8 bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute left-0 h-px w-8 bg-current transition-all duration-300 ${open ? "top-4 -rotate-45" : "top-6"}`} />
        </button>

        <Link
          to="/contact"
          onClick={close}
          className="flex items-stretch bg-black text-white outline outline-1 outline-white/20 focus-visible:outline-brand-yellow"
        >
          <span className="flex items-center px-2.5 text-[10px] font-bold uppercase tracking-wide md:px-4 md:text-[11px]">Let's talk</span>
          <span className="m-1 flex h-8 w-8 items-center justify-center bg-brand-yellow text-black">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </span>
        </Link>
      </header>
      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
