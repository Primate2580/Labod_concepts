import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  // Scroll to top on route change (block body so nothing is returned)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
