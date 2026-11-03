import { Link } from "react-router-dom";
import services from "../data/services.js";

export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
      <h1 className="sr-only">Services</h1>
      <div>
        {services.map((s) => (
          <div key={s.title} className="grid gap-3 border-t border-white/15 py-8 md:grid-cols-2">
            <h2 className="font-display text-2xl font-bold uppercase">{s.title}</h2>
            <p className="max-w-md text-white/70">{s.text}</p>
          </div>
        ))}
      </div>
      <Link to="/contact" className="mt-10 inline-block rounded-full bg-brand-yellow px-7 py-3 text-xs font-bold uppercase text-black">Start a project</Link>
    </section>
  );
}
