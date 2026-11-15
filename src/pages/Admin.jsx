import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseEnabled, PUBLIC_BUCKET, PRIVATE_BUCKET, pathFromUrl } from "../lib/supabase.js";
import useProjects from "../hooks/useProjects.js";
import ProjectForm from "../components/admin/ProjectForm.jsx";

const inp = "w-full rounded border border-white/25 bg-white/5 px-3 py-3 text-white focus:border-brand-yellow focus:outline-none";
const btnY = "rounded-full bg-brand-yellow px-6 py-3 text-xs font-bold uppercase text-black";
const btnG = "rounded-full border border-white/40 px-4 py-2 text-xs uppercase hover:border-white";

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr("The email or password is not correct.");
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-sm space-y-5">
      <h1 className="font-display text-3xl font-extrabold uppercase">Admin login</h1>
      <input type="email" required placeholder="Email" className={inp} value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required placeholder="Password" className={inp} value={pw} onChange={(e) => setPw(e.target.value)} />
      {err && <p role="alert" className="text-sm text-amber">{err}</p>}
      <button className={btnY}>Sign in</button>
    </form>
  );
}

function ProjectList({ onEdit }) {
  const { remote, loading, reload } = useProjects();
  const [busyId, setBusyId] = useState("");

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}" and all of its files? This cannot be undone.`)) return;
    setBusyId(p.id);
    const pub = [...p.images, ...p.floorPlans.map((x) => x.url)].map(pathFromUrl).filter(Boolean);
    const priv = p.sourceFiles.map((s) => s.path);
    if (pub.length) await supabase.storage.from(PUBLIC_BUCKET).remove(pub);
    if (priv.length) await supabase.storage.from(PRIVATE_BUCKET).remove(priv);
    await supabase.from("projects").delete().eq("id", p.id);
    setBusyId("");
    reload();
  };
  const download = async (path) => {
    const w = window.open("", "_blank"); // opened first so the browser does not block it
    const { data } = await supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(path, 120);
    if (data?.signedUrl) w.location = data.signedUrl; else w.close();
  };

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (remote.length === 0) return <p className="text-white/60">No projects added here yet. Use "Add project" to create the first one.</p>;

  return (
    <ul className="space-y-4">
      {remote.map((p) => (
        <li key={p.id} className="flex flex-col gap-4 rounded bg-white/5 p-4 sm:flex-row sm:items-center">
          <img src={p.cover} alt="" className="aspect-[4/3] w-full object-cover sm:w-32" />
          <div className="flex-1">
            <p className="font-display text-lg font-bold uppercase">{p.title}</p>
            <p className="text-sm text-white/60">{p.location}</p>
            <p className="text-sm text-white/60">{p.category}, {p.images.length} photos, {p.floorPlans.length} floor plans</p>
            {(p.sourceFiles.length > 0 || p.sourceLink) && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {p.sourceFiles.map((s) => (
                  <button key={s.path} onClick={() => download(s.path)} className="rounded-full border border-white/40 px-3 py-1 hover:border-white">Download {s.name}</button>
                ))}
                {p.sourceLink && <a href={p.sourceLink} target="_blank" rel="noreferrer" className="rounded-full border border-white/40 px-3 py-1 hover:border-white">Open source link</a>}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(p)} disabled={busyId === p.id} className={btnG}>Edit</button>
            <button onClick={() => remove(p)} disabled={busyId === p.id} className="rounded-full border border-amber px-4 py-2 text-xs uppercase text-amber disabled:opacity-50">
              {busyId === p.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [tab, setTab] = useState("add");       // add | list | edit
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabaseEnabled) { setUser(null); return; }
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const go = (t) => { setTab(t); setNotice(""); setEditing(null); };

  return (
    <div className="min-h-screen bg-ink px-5 pb-24 pt-6 md:px-12">
      <header className="mx-auto flex max-w-3xl items-center justify-between border-b border-white/15 pb-4">
        <span className="font-display text-sm font-bold uppercase">LABOD admin</span>
        <div className="flex gap-4 text-xs uppercase">
          <Link to="/" className="underline underline-offset-4">View site</Link>
          {user && <button onClick={() => supabase.auth.signOut()} className="text-amber">Sign out</button>}
        </div>
      </header>

      <main className="mx-auto max-w-3xl">
        {!supabaseEnabled && (
          <p className="mt-16 rounded bg-white/5 p-6">The admin area is not connected yet. Follow ADMIN-SETUP.md to link your Supabase project, then restart the site.</p>
        )}
        {supabaseEnabled && user === undefined && <p className="mt-16 text-white/60">Loading...</p>}
        {supabaseEnabled && user === null && <Login />}
        {supabaseEnabled && user && (
          <>
            <div className="mt-8 flex gap-3">
              {[["add", "Add project"], ["list", "My projects"]].map(([k, l]) => (
                <button key={k} onClick={() => go(k)} aria-pressed={tab === k}
                  className={`rounded-full border px-5 py-2 text-xs uppercase ${tab === k ? "border-brand-yellow bg-brand-yellow text-black" : "border-white/40"}`}>{l}</button>
              ))}
            </div>
            <div className="mt-8">
              {notice && <p role="status" className="mb-6 rounded bg-brand-yellow/15 px-4 py-3 text-brand-yellow">{notice}</p>}
              {tab === "add" && <ProjectForm key="new" onDone={() => setNotice("Project published. It is now on the Projects page.")} />}
              {tab === "list" && <ProjectList onEdit={(p) => { setEditing(p); setTab("edit"); setNotice(""); }} />}
              {tab === "edit" && editing && (
                <>
                  <h2 className="mb-6 font-display text-2xl font-bold uppercase">Edit: {editing.title}</h2>
                  <ProjectForm key={editing.id} project={editing}
                    onDone={() => { go("list"); setNotice("Changes saved."); }} onCancel={() => go("list")} />
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
