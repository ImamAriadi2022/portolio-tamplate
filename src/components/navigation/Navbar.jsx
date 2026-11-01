import { useState, useEffect } from "react";
import { getNavigation } from "../../utils/dataHelpers.js";
import { useRouter, isRouteActive } from "../../hooks/useRouter.js";
import AppLink from "../shared/AppLink.jsx";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useRouter();
  const menus = getNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="Navbar py-7 flex items-center justify-between relative z-40">
      <div className="logo">
        <AppLink to="/" className="inline-block">
          <h1 className="text-3xl font-bold bg-white text-black px-2 py-1 rounded-md md:bg-transparent md:text-white md:p-0">
            Portofolio
          </h1>
        </AppLink>
      </div>

      <nav aria-label="Main Navigation">
        <ul
          className={`menu flex items-center flex-wrap justify-center sm:gap-6 md:gap-8 gap-2 md:static fixed left-1/2 -translate-x-1/2 md:translate-x-0 z-50 w-[94%] sm:w-auto bg-zinc-800/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-4 py-3 md:p-0 rounded-2xl border border-zinc-700/70 md:border-none shadow-lg md:shadow-none transition-all duration-300 ${
            scrolled ? "top-3" : "top-20 md:top-0"
          }`}
        >
          {menus.map((menu) => {
            const active = isRouteActive(pathname, menu.path);
            return (
              <li key={menu.path}>
                <AppLink
                  to={menu.path}
                  aria-current={active ? "page" : undefined}
                  className={`sm:text-base text-xs font-medium px-3 py-1.5 rounded-xl transition-colors inline-block ${
                    active
                      ? "bg-violet-700 text-white"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {menu.label}
                </AppLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
