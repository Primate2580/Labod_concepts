import { useState, useCallback } from "react";
import projects from "../data/projects.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Projects() {
  // Filters are generated from the data, so new categories appear automatically
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const [index, setIndex] = useState(0);

  const open = (p) => { setIndex(0); setActive(p); };
  const close = useCallback(() => setActive(null), []);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
      <h1 className="sr-only">Projects</h1>
      <p className="max-w-xl text-white/70">Select a project to see all of its photos.</p>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filter projects">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
            className={`rounded-full border px-5 py-2 text-xs uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow ${
              filter === c ? "border-brand-yellow bg-brand-yellow text-black" : "border-white/40 hover:border-white"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <ProjectCard key={p.id} project={p} onOpen={open} />)}
      </div>

      {active && <Lightbox project={active} index={index} setIndex={setIndex} onClose={close} />}
    </section>
  );
}
