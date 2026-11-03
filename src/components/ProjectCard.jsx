// One cover picture per project group. Click opens that group's gallery.
export default function ProjectCard({ project, onOpen }) {
  return (
    <button onClick={() => onOpen(project)} className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow">
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <img src={project.cover} alt={`${project.title}, ${project.location}`} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 rounded-full border border-white/70 bg-black/30 px-3 py-1 text-[11px] uppercase backdrop-blur-md">
          {project.images.length} photos
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-bold uppercase">{project.title}</h3>
        <span className="text-sm text-white/60">{project.category}</span>
      </div>
      <p className="text-sm text-white/60">{project.location}</p>
    </button>
  );
}
