// Placeholder copy: replace with the client's real story, numbers and team.
const numbers = [["12", "Years in practice"], ["80+", "Projects completed"], ["5", "Services under one roof"]];
const values = [
  ["Clear process", "You know what happens next at every stage, and what it costs."],
  ["Built to last", "We choose materials and details for how the building will age."],
  ["Designed for people", "Every plan starts with how the space will actually be used."],
];
const team = [["Full Name", "Principal Architect"], ["Full Name", "Interior Designer"], ["Full Name", "Project Manager"]];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12">
      <h1 className="sr-only">About</h1>
      <p className="max-w-2xl text-lg text-white/75">
        LABOD is an architecture studio that designs and delivers homes, interiors and commercial
        buildings. We work with clients from the first sketch to handover, so the building you
        approve on paper is the one you get.
      </p>

      <dl className="mt-16 grid gap-8 border-y border-white/15 py-10 sm:grid-cols-3">
        {numbers.map(([n, l]) => (
          <div key={l}>
            <dt className="text-sm text-white/60">{l}</dt>
            <dd className="font-display text-5xl font-extrabold text-amber">{n}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-16 font-display text-3xl font-bold uppercase">How we work</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-3">
        {values.map(([t, d]) => (
          <div key={t}><h3 className="font-semibold">{t}</h3><p className="mt-2 text-white/70">{d}</p></div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl font-bold uppercase">Team</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {team.map(([n, r], i) => (
          <div key={i}>
            <div className="aspect-square bg-white/5" aria-hidden="true" />
            <p className="mt-3 font-semibold">{n}</p>
            <p className="text-sm text-white/60">{r}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
