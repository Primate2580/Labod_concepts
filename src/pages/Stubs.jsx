// Placeholders so every route works. Each gets replaced in a later step.
const Stub = ({ title }) => (
  <section className="px-6 pb-24 pt-40 md:px-12">
    <h1 className="font-display text-5xl font-extrabold uppercase md:text-7xl">{title}</h1>
  </section>
);
export const About = () => <Stub title="About" />;
export const Projects = () => <Stub title="Projects" />;
export const Services = () => <Stub title="Services" />;
export const Contact = () => <Stub title="Contact" />;
