import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { navLinks } from "./MenuOverlay.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* <Logo variant="white" className="h-16" /> */}
        <ul className="space-y-2 text-sm text-white/70">
          {navLinks.map((l) => (
            <li key={l.to}><Link to={l.to} className="hover:text-white">{l.label}</Link></li>
          ))}
        </ul>
        <div className="text-sm text-white/70">
          <p>larryaboderin@gmail.com</p>
          <p>+234 80 6904 9291</p>
          <p className="mt-6 text-white/40">© {new Date().getFullYear()} LABOD Architecture</p>
        </div>
      </div>
    </footer>
  );
}
