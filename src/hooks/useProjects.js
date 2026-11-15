import { useCallback, useEffect, useState } from "react";
import staticProjects from "../data/projects.js";
import { supabase, supabaseEnabled } from "../lib/supabase.js";

const normalize = (r) => ({
  id: r.id,
  title: r.title,
  location: r.location,
  category: r.category,
  year: r.year,
  sqft: r.sqft,
  cover: r.cover,
  images: r.images || [],
  floorPlans: r.floor_plans || [],
  sourceFiles: r.source_files || [],
  sourceLink: r.source_link || "",
});

// Projects added in the admin dashboard (newest first), followed by the ones in
// src/data/projects.js. If Supabase is off or unreachable, only the static ones show.
export default function useProjects() {
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(supabaseEnabled);

  const load = useCallback(async () => {
    if (!supabaseEnabled) return;
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (!error) setRemote((data || []).map(normalize));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { projects: [...remote, ...staticProjects], remote, loading, reload: load };
}
