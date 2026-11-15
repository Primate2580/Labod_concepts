import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If .env is not filled in, the site still works using src/data/projects.js only.
export const supabaseEnabled = Boolean(url && key);
export const supabase = supabaseEnabled ? createClient(url, key) : null;

// Two storage buckets: photos + floor plans are public, source files are private.
export const PUBLIC_BUCKET = "projects";
export const PRIVATE_BUCKET = "private-files";
export const MAX_FILE_MB = 50; // Supabase free plan limit per file
// Storage path of a public file, taken from its public URL (used when deleting)
export const pathFromUrl = (url) => decodeURIComponent(url.split(`/object/public/${PUBLIC_BUCKET}/`)[1] || "");
