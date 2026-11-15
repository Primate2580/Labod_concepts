import { useEffect, useMemo, useState } from "react";
import { supabase, PUBLIC_BUCKET as PUB, PRIVATE_BUCKET as PRIV, MAX_FILE_MB, pathFromUrl } from "../../lib/supabase.js";
import useProjects from "../../hooks/useProjects.js";

const PHOTO_EXT = ["jpg", "jpeg", "jfif", "png", "webp", "avif"];
const PHOTO_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const SOURCE_EXT = ["dwg", "dxf", "rvt", "pcp"];

const lbl = "mb-1 block text-sm text-white/70";
const inp = "w-full rounded border border-white/25 bg-white/5 px-3 py-3 text-white placeholder-white/40 focus:border-brand-yellow focus:outline-none [&>option]:bg-black";
const btnY = "rounded-full bg-brand-yellow px-5 py-2.5 text-xs font-bold uppercase text-black disabled:opacity-50";
const btnG = "rounded-full border border-white/40 px-4 py-2 text-xs uppercase hover:border-white";
const fileInp = "block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/15 file:px-4 file:py-2 file:text-xs file:uppercase file:text-white";

const uid = () => Math.random().toString(36).slice(2);
const extOf = (f) => f.name.split(".").pop().toLowerCase();

// Big phone photos are shrunk to 2200px JPEG so the website stays fast.
// Small photos, or any photo that cannot be shrunk, are uploaded exactly as they are.
async function prepare(file) {
  const ext = { jpeg: "jpg", jfif: "jpg" }[extOf(file)] || extOf(file);
  const keep = { body: file, ext, type: file.type || "image/jpeg" };
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, 2200 / Math.max(bmp.width, bmp.height));
    if (s === 1 && file.size < 1.5 * 1024 * 1024) return keep;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s);
    c.height = Math.round(bmp.height * s);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob && blob.size > 0 && blob.size < file.size ? { body: blob, ext: "jpg", type: "image/jpeg" } : keep;
  } catch {
    return keep;
  }
}

// Pick from the existing list, or add a new one that is then saved for next time
function OptionField({ label, value, onChange, options, onCreate }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const save = async () => {
    const v = name.trim();
    if (!v) return;
    await onCreate(v);
    onChange(v);
    setName("");
    setAdding(false);
  };
  return (
    <div>
      <label className={lbl}>{label}</label>
      {adding ? (
        <div className="flex gap-2">
          <input autoFocus className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder={`New ${label.toLowerCase()}`} />
          <button type="button" onClick={save} className={btnY}>Add</button>
          <button type="button" onClick={() => setAdding(false)} className={btnG}>Cancel</button>
        </div>
      ) : (
        <select className={inp} value={value} onChange={(e) => (e.target.value === "__new" ? setAdding(true) : onChange(e.target.value))}>
          <option value="">Choose...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
          <option value="__new">+ Add new {label.toLowerCase()}...</option>
        </select>
      )}
    </div>
  );
}

function FileList({ title, hint, accept, items, onAdd, onRemove }) {
  return (
    <div>
      <label className={lbl}>{title} <span className="text-white/40">({hint})</span></label>
      <input type="file" multiple accept={accept} onChange={onAdd} className={fileInp} />
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((it) => (
          <li key={it.key} className="flex items-center justify-between rounded bg-white/5 px-3 py-2">
            <span className="truncate">{it.name}</span>
            <button type="button" onClick={() => onRemove(it.key)} className="ml-3 text-xs uppercase text-amber">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Add a new project, or edit one when `project` is given.
export default function ProjectForm({ project, onDone, onCancel }) {
  const { projects } = useProjects();
  const [saved, setSaved] = useState({ category: [], location: [] }); // lists the client created
  const [f, setF] = useState({
    title: project?.title || "",
    location: project?.location || "",
    category: project?.category || "",
    year: String(project?.year ?? new Date().getFullYear()),
    sqft: project?.sqft ? String(project.sqft) : "",
    link: project?.sourceLink || "",
  });
  // photos: first = cover. Items already on the site have url only; new ones have a file.
  const [photos, setPhotos] = useState(() => (project?.images || []).map((url, i) => ({ key: "e" + i, url })));
  const [plans, setPlans] = useState(() => (project?.floorPlans || []).map((p, i) => ({ key: "e" + i, name: p.name, url: p.url })));
  const [sources, setSources] = useState(() => (project?.sourceFiles || []).map((s, i) => ({ key: "e" + i, name: s.name, path: s.path })));
  const [error, setError] = useState("");
  const [photoMsg, setPhotoMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    supabase.from("options").select("*").then(({ data }) => {
      const g = { category: [], location: [] };
      (data || []).forEach((o) => g[o.kind]?.push(o.name));
      setSaved(g);
    });
  }, []);

  const uniq = (a) => [...new Set(a.filter(Boolean))].sort((x, y) => x.localeCompare(y));
  const categories = useMemo(() => uniq([...projects.map((p) => p.category), ...saved.category]), [projects, saved]);
  const locations = useMemo(() => uniq([...projects.map((p) => p.location), ...saved.location]), [projects, saved]);
  const addOption = (kind) => async (name) => {
    await supabase.from("options").upsert({ kind, name });
    setSaved((s) => ({ ...s, [kind]: [...s[kind], name] }));
  };

  // Accept only allowed types and sizes; say clearly what was added and what was skipped
  const pick = (allowed, setter, make, report = setError, mimes = []) => (e) => {
    try {
      const skipped = [];
      const ok = [...e.target.files].filter((file) => {
        const ext = extOf(file);
        if (ext === "heic" || ext === "heif") { skipped.push(`${file.name} (HEIC is not supported, save it as JPG first)`); return false; }
        if (!allowed.includes(ext) && !mimes.includes(file.type)) { skipped.push(`${file.name} (this file type is not allowed)`); return false; }
        if (file.size > MAX_FILE_MB * 1024 * 1024) { skipped.push(`${file.name} (over ${MAX_FILE_MB} MB)`); return false; }
        return true;
      });
      setter((prev) => [...prev, ...ok.map(make)]);
      report(skipped.length ? `Skipped: ${skipped.join(", ")}` : "");
    } catch (err) {
      console.error(err);
      report(`The file could not be read: ${err.message}`);
    }
    e.target.value = "";
  };
  const drop = (setter) => (key) => setter((x) => x.filter((i) => i.key !== key));
  const makeCover = (key) => setPhotos((p) => [p.find((x) => x.key === key), ...p.filter((x) => x.key !== key)]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim()) return setError("Please enter the project name.");
    if (!f.location) return setError("Please choose a location.");
    if (!f.category) return setError("Please choose a category.");
    if (photos.length === 0) return setError("Please add at least one photo. The first photo is the cover.");

    const id = project?.id || crypto.randomUUID();
    const jobs = [
      ...photos.filter((p) => p.file).map((item) => ({ kind: "photo", item })),
      ...plans.filter((p) => p.file).map((item) => ({ kind: "plan", item })),
      ...sources.filter((p) => p.file).map((item) => ({ kind: "source", item })),
    ];
    const folder = { photo: "photos", plan: "floorplans", source: "files" };
    const uploaded = []; // { bucket, path } for cleanup if something fails
    const done = {};     // item key -> public URL (photo/plan) or private path (source)

    setBusy(true);
    try {
      for (let i = 0; i < jobs.length; i++) {
        const { kind, item } = jobs[i];
        setStatus(`Uploading file ${i + 1} of ${jobs.length}: ${item.file.name}`);
        setPercent(Math.round((i / jobs.length) * 100));
        const prep = kind === "photo" ? await prepare(item.file) : { body: item.file, ext: extOf(item.file), type: item.file.type || "application/octet-stream" };
        const safe = item.file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 40) || "file";
        const bucket = kind === "source" ? PRIV : PUB;
        const send = async (pr) => {
          const path = `${id}/${folder[kind]}/${Date.now()}-${i}-${safe}.${pr.ext}`;
          const { error } = await supabase.storage.from(bucket).upload(path, pr.body, { contentType: pr.type });
          return { error, path };
        };
        let res = await send(prep);
        if (res.error && kind === "photo" && prep.body !== item.file) {
          res = await send({ body: item.file, ext: extOf(item.file), type: item.file.type || "image/jpeg" });
        }
        if (res.error) throw new Error(`${item.file.name}: ${res.error.message}`);
        const path = res.path;
        uploaded.push({ bucket, path });
        done[item.key] = kind === "source" ? path : supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
      setPercent(100);

      const images = photos.map((p) => (p.file ? done[p.key] : p.url));
      const floorPlans = plans.map((p) => ({ name: p.name, url: p.file ? done[p.key] : p.url }));
      const sourceFiles = sources.map((s) => ({ name: s.name, path: s.file ? done[s.key] : s.path }));
      const row = {
        title: f.title.trim(), location: f.location, category: f.category,
        year: Number(f.year) || null, sqft: Number(f.sqft) || null,
        cover: images[0], images, floor_plans: floorPlans, source_files: sourceFiles,
        source_link: f.link.trim() || null,
      };
      const { error: dbErr } = project
        ? await supabase.from("projects").update(row).eq("id", id)
        : await supabase.from("projects").insert({ id, ...row });
      if (dbErr) throw dbErr;

      // Editing: delete the files the client took out
      if (project) {
        const keepPub = new Set([...images, ...floorPlans.map((p) => p.url)].map(pathFromUrl));
        const oldPub = [...project.images, ...project.floorPlans.map((p) => p.url)].map(pathFromUrl).filter((p) => p && !keepPub.has(p));
        const keepPriv = new Set(sourceFiles.map((s) => s.path));
        const oldPriv = (project.sourceFiles || []).map((s) => s.path).filter((p) => !keepPriv.has(p));
        if (oldPub.length) await supabase.storage.from(PUB).remove(oldPub);
        if (oldPriv.length) await supabase.storage.from(PRIV).remove(oldPriv);
      }

      if (!project) { setF({ ...f, title: "", sqft: "", link: "" }); setPhotos([]); setPlans([]); setSources([]); }
      onDone?.();
    } catch (err) {
      console.error(err);
      for (const bucket of [PUB, PRIV]) {
        const paths = uploaded.filter((u) => u.bucket === bucket).map((u) => u.path);
        if (paths.length) await supabase.storage.from(bucket).remove(paths);
      }
      const m = (err.message || "").toLowerCase();
      const hint =
        m.includes("row-level security") ? "The email you signed in with is not the admin email set in setup.sql, or setup.sql was not run. "
        : m.includes("bucket not found") ? "The storage buckets are missing: run supabase/setup.sql. "
        : m.includes("maximum allowed size") || m.includes("too large") ? "A file is bigger than 50 MB. "
        : m.includes("jwt") || m.includes("not authenticated") ? "You were signed out: sign in again. "
        : m.includes("failed to fetch") ? "No connection to Supabase: check your internet and the two VITE_SUPABASE values on Vercel. "
        : "";
      setError(`Nothing was saved. ${hint}(${err.message || "unknown error"})`);
    } finally {
      setBusy(false);
      setStatus("");
      setPercent(0);
    }
  };

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="space-y-7">
      <div>
        <label className={lbl}>Project name</label>
        <input className={inp} value={f.title} onChange={set("title")} placeholder="e.g. Harbour Residence" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <OptionField label="Location" value={f.location} onChange={(v) => setF({ ...f, location: v })} options={locations} onCreate={addOption("location")} />
        <OptionField label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={categories} onCreate={addOption("category")} />
        <div>
          <label className={lbl}>Year completed</label>
          <input type="number" className={inp} value={f.year} onChange={set("year")} />
        </div>
        <div>
          <label className={lbl}>Size in sqft (optional)</label>
          <input type="number" className={inp} value={f.sqft} onChange={set("sqft")} />
        </div>
      </div>

      <div>
        <label className={lbl}>Photos <span className="text-white/40">(JPG, PNG or WEBP. The first photo is the cover)</span></label>
        <input type="file" multiple accept=".jpg,.jpeg,.jfif,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif" className={fileInp}
          onChange={pick(PHOTO_EXT, setPhotos, (file) => ({ key: uid(), url: URL.createObjectURL(file), file }), setPhotoMsg, PHOTO_MIME)} />
        {photoMsg && <p role="alert" className="mt-2 text-sm text-amber">{photoMsg}</p>}
        {photos.length > 0 && <p className="mt-2 text-sm text-white/60">{photos.length} photo{photos.length > 1 ? "s" : ""} ready to upload</p>}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={p.key} className="relative">
              <img src={p.url} alt="" className="aspect-[4/3] w-full object-cover" />
              {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-black">Cover</span>}
              <div className="mt-1 flex justify-between text-[11px] uppercase">
                {i !== 0 ? <button type="button" onClick={() => makeCover(p.key)} className="text-brand-yellow">Make cover</button> : <span />}
                <button type="button" onClick={() => drop(setPhotos)(p.key)} className="text-amber">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FileList title="Floor plans" hint="PDF, shown on the website" accept=".pdf" items={plans}
        onAdd={pick(["pdf"], setPlans, (file) => ({ key: uid(), name: file.name, file }))} onRemove={drop(setPlans)} />
      <FileList title="Source files" hint={`DWG, DXF, RVT, PCP, up to ${MAX_FILE_MB} MB each. Private: only you can download these`} accept=".dwg,.dxf,.rvt,.pcp" items={sources}
        onAdd={pick(SOURCE_EXT, setSources, (file) => ({ key: uid(), name: file.name, file }))} onRemove={drop(setSources)} />

      <div>
        <label className={lbl}>Link to larger source files <span className="text-white/40">(optional: paste a Google Drive or Dropbox link, only you see it)</span></label>
        <input type="url" className={inp} value={f.link} onChange={set("link")} placeholder="https://..." />
      </div>

      {error && <p role="alert" className="rounded bg-amber/15 px-4 py-3 text-sm text-amber">{error}</p>}
      {busy && (
        <div>
          <p className="text-sm text-white/70">{status || "Saving..."} ({percent}%)</p>
          <div className="mt-2 h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-brand-yellow transition-all" style={{ width: `${percent}%` }} /></div>
          <p className="mt-2 text-xs text-white/50">Please keep this page open until it finishes.</p>
        </div>
      )}
      <div className="flex gap-3">
        <button disabled={busy} className={btnY}>{busy ? "Saving..." : project ? "Save changes" : "Publish project"}</button>
        {project && <button type="button" onClick={onCancel} disabled={busy} className={btnG}>Cancel</button>}
      </div>
    </form>
  );
}
