import { Link } from "react-router-dom";
import DrawnTitle from "../components/DrawnTitle.jsx";
import projects from "../data/projects.js";
import services from "../data/services.js";

// Hero is driven by the first project in projects.js
function Hero({ project }) {
  const pill =
    "rounded-full border border-white/70 bg-white/10 px-4 py-2.5 text-[10px] md:px-5 md:py-3 md:text-[11px] font-medium uppercase tracking-wide backdrop-blur-md";
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      <img src={project.cover} alt={`${project.title}, ${project.location}`}
        fetchpriority="high"
        style={{ objectPosition: project.focus || "center" }}
        className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />

      {/* Thin rounded inset frame */}
      <div className="pointer-events-none absolute inset-3 rounded-3xl border border-white/70 md:inset-5" />

      <div className="absolute inset-x-0 bottom-28 px-6 text-center md:bottom-32">
        <DrawnTitle title={project.title} location={project.location} />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-7 pb-7 md:px-14 md:pb-12">
        <span className={pill}>{project.category}</span>
        <span className={pill}>{project.sqft} sqft</span>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero project={projects[0]} />

      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:px-12">
        <p className="font-display text-2xl font-bold leading-snug md:text-4xl">
          We design homes, interiors and commercial buildings, and manage them through to handover.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 md:px-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">Featured projects</h2>
          <Link to="/projects" className="text-sm underline underline-offset-4">All projects</Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <Link key={p.id} to="/projects" className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-white/5">
                <img src={p.cover} alt={`${p.title}, ${p.location}`} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold uppercase">{p.title}</h3>
              <p className="text-sm text-white/60">{p.location}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-white/15 px-6 py-24 md:px-12">
        <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">What we do</h2>
        <ul className="mt-10 grid gap-x-10 gap-y-6 text-white/80 sm:grid-cols-2">
          {services.map((s) => <li key={s.title} className="border-b border-white/15 pb-4">{s.title}</li>)}
        </ul>
      </section>
    </>
  );
}
