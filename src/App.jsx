import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// Admin is loaded only when /admin is opened, so the public site stays light
const Admin = lazy(() => import("./pages/Admin.jsx"));
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
