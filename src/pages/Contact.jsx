import { useState } from "react";

const types = ["Residential", "Commercial", "Interior", "Other"];
const field = "w-full border-b border-white/30 bg-transparent py-3 text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: types[0], message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) err.message = "Tell us a little about the project.";
    setErrors(err);
    // TODO: send `form` to your backend or a form service (Formspree, EmailJS...)
    if (!Object.keys(err).length) setSent(true);
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-32 md:grid-cols-2 md:px-12">
      <div>
        <h1 className="sr-only">Contact</h1>
        <p className="text-white/70">Tell us about your project and we will reply within two working days.</p>
        <div className="mt-8 space-y-1 text-white/80">
          <p>larryaboderin@gmail.com</p><p>+234 80 6904 9291</p><p>Ibadan, Oyo State, Nigeria</p>
        </div>
        <div className="mt-8 flex aspect-video items-center justify-center bg-white/5 text-sm text-white/40">Map goes here</div>
      </div>

      {sent ? (
        <p className="self-center text-xl">Thank you, {form.name}. We have your message.</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm text-white/60">Name</label>
            <input id="name" className={field} value={form.name} onChange={set("name")} />
            {errors.name && <p className="mt-1 text-sm text-amber">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-sm text-white/60">Email</label>
            <input id="email" type="email" className={field} value={form.email} onChange={set("email")} />
            {errors.email && <p className="mt-1 text-sm text-amber">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm text-white/60">Phone</label>
            <input id="phone" type="tel" className={field} value={form.phone} onChange={set("phone")} />
          </div>
          <div>
           
            <label htmlFor="type" className="text-sm text-white/60">Project type</label>
            <select id="type" className={`${field} bg-black text-white`} value={form.type} onChange={set("type")}>
              {types.map((t) => <option key={t}className="bg-black text-white">{t}</option>)}
            </select>

          </div>
          <div>
            <label htmlFor="message" className="text-sm text-white/60">Message</label>
            <textarea id="message" rows="4" className={field} value={form.message} onChange={set("message")} />
            {errors.message && <p className="mt-1 text-sm text-amber">{errors.message}</p>}
          </div>
          <button className="rounded-full bg-brand-yellow px-8 py-3 text-xs font-bold uppercase text-black">Send message</button>
        </form>
      )}
    </section>
  );
}
