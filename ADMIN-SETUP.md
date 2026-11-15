# Admin dashboard setup (one time, free plan)

The dashboard is at `/admin` (e.g. http://localhost:5173/admin). It is not linked in the menu.

1. Create a free account and a new project at https://supabase.com (pick a region close to your visitors).
2. **Turn off public sign-ups:** Authentication > Sign In / Providers > Email > switch off
   "Allow new users to sign up".
3. **Add the client's login:** Authentication > Users > Add user > Create new user. Enter his email and a
   password and tick "Auto Confirm User".
4. Open `supabase/setup.sql`, replace `ADMIN_EMAIL_HERE` with his email (one place), then paste the whole
   file into SQL Editor > New query and click Run. This creates the tables, the two storage buckets and
   the security rules.
5. Project Settings > API: copy the **Project URL** and the **anon / publishable key**.
6. Copy `.env.example` to `.env` and paste both values in.
7. Run `npm install` (new package), then `npm run dev`.
8. When you deploy (Netlify/Vercel), add the same two `VITE_SUPABASE_...` values as environment variables,
   and add a rewrite so every path serves `index.html` (so /admin and /projects work on refresh).

## Free plan limits (checked July 2026, they can change)
- 1 GB total file storage, 50 MB per file, 5 GB bandwidth per month.
- A free project **pauses after 1 week with no activity**. Visitors loading the site count as activity,
  but a very quiet site can pause. You can resume it with one click in the Supabase dashboard.
  While paused the sample projects and the hero still show, but the client's uploaded photos do not.

## What the client can do
- Add, edit and delete projects (name, location, category, year, size).
- Photos (first = cover, can be changed), floor plans (PDF, shown on the site), source files
  (DWG, DXF, RVT, PCP up to 50 MB, private) and an optional private link (Drive/Dropbox) for bigger files.
- Choose an existing location/category, or "+ Add new" to create one.
