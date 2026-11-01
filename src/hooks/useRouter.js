import { useSyncExternalStore, useCallback } from "react";

const NAVIGATION_EVENT = "app:navigate";

function subscribeToLocation(callback) {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATION_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATION_EVENT, callback);
  };
}

function getLocationSnapshot() {
  if (typeof window === "undefined") return "/";
  const raw = window.location.pathname || "/";
  if (raw.length > 1 && raw.endsWith("/")) {
    return raw.slice(0, -1);
  }
  return raw;
}

/**
 * Navigasi secara programatik menggunakan History API.
 * @param {string} to
 * @param {{ replace?: boolean, scroll?: boolean }} options
 */
export function navigateTo(to, options = {}) {
  if (typeof window === "undefined") return;
  const target = to && to.startsWith("/") ? to : `/${to || ""}`;
  const normalizedTarget =
    target.length > 1 && target.endsWith("/") ? target.slice(0, -1) : target;

  if (window.location.pathname !== normalizedTarget) {
    if (options.replace) {
      window.history.replaceState({}, "", normalizedTarget);
    } else {
      window.history.pushState({}, "", normalizedTarget);
    }
    window.dispatchEvent(new Event(NAVIGATION_EVENT));
  }

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Mencocokkan pathname saat ini dengan struktur halaman dan parameter slug.
 * @param {string} pathname
 */
export function matchRoute(pathname) {
  const cleanPath =
    pathname && pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname || "/";

  if (cleanPath === "/") {
    return { page: "home", params: {} };
  }
  if (cleanPath === "/projects") {
    return { page: "projects", params: {} };
  }
  const projectMatch = cleanPath.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    return { page: "project-detail", params: { slug: projectMatch[1] } };
  }

  if (cleanPath === "/certifications") {
    return { page: "certifications", params: {} };
  }
  const certMatch = cleanPath.match(/^\/certifications\/([^/]+)$/);
  if (certMatch) {
    return { page: "certification-detail", params: { slug: certMatch[1] } };
  }

  if (cleanPath === "/experience") {
    return { page: "experience", params: {} };
  }
  const expMatch = cleanPath.match(/^\/experience\/([^/]+)$/);
  if (expMatch) {
    return { page: "experience-detail", params: { slug: expMatch[1] } };
  }

  if (cleanPath === "/contact") {
    return { page: "contact", params: {} };
  }

  return { page: "not-found", params: {} };
}

/**
 * Mengecek apakah menu navigasi sedang aktif berdasarkan pathname saat ini.
 * @param {string} currentPath
 * @param {string} menuPath
 */
export function isRouteActive(currentPath, menuPath) {
  if (!menuPath) return false;
  if (menuPath === "/") {
    return currentPath === "/";
  }
  return currentPath === menuPath || currentPath.startsWith(`${menuPath}/`);
}

/**
 * Hook React untuk mengakses rute aktif, parameter slug, dan fungsi navigasi.
 */
export function useRouter() {
  const pathname = useSyncExternalStore(
    subscribeToLocation,
    getLocationSnapshot,
    () => "/"
  );

  const navigate = useCallback((to, options) => {
    navigateTo(to, options);
  }, []);

  const route = matchRoute(pathname);

  return {
    pathname,
    page: route.page,
    params: route.params,
    navigate,
  };
}
