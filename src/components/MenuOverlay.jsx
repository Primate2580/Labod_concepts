import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function MenuOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const items = () => [...document.querySelectorAll("[data-trap]")];
    items()[1]?.focus(); // first link (index 0 is the toggle)

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Focus trap: loop between the toggle and the menu links
        const list = items();
        const first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="site-menu"
      {...(open ? {} : { inert: "" })}
      className={`fixed inset-0 z-40 flex items-center bg-ink px-6 transition-all duration-500 md:px-16 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <nav aria-label="Main">
        <ul className="space-y-3">
          {navLinks.map((l, i) => (
            <li key={l.to} className="overflow-hidden">
              <NavLink
                to={l.to}
                end={l.to === "/"}
                data-trap
                onClick={onClose}
                style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
                className={({ isActive }) =>
                  `block font-display text-3xl font-extrabold uppercase transition-all duration-500 hover:text-amber focus-visible:text-amber focus-visible:outline-none md:text-5xl ${
                    open ? "translate-y-0" : "translate-y-full"
                  } ${isActive ? "text-amber" : "text-white"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
