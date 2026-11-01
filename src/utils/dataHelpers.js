import profileRaw from "../../data/profile.json" with { type: "json" };
import skillsRaw from "../../data/skills.json" with { type: "json" };
import projectsRaw from "../../data/projects.json" with { type: "json" };
import certificationsRaw from "../../data/certifications.json" with { type: "json" };
import experiencesRaw from "../../data/experiences.json" with { type: "json" };
import contactRaw from "../../data/contact.json" with { type: "json" };
import navigationRaw from "../../data/navigation.json" with { type: "json" };

import { ensureItemSlug, normalizeSlug } from "./slug.js";
import { sortCertificationsByDate, sortExperiencesByDate } from "./sorting.js";

/**
 * Daftar alias ikon skill agar penulisan di `data/skills.json` fleksibel:
 * Bisa menulis nama pendek ("react", "tailwind", "figma") atau path gambar ("/assets/tools/reactjs.png").
 */
const SKILL_ICON_MAP = {
  vscode: { type: "image", src: "/assets/tools/vscode.png" },
  "visual studio code": { type: "image", src: "/assets/tools/vscode.png" },
  react: { type: "image", src: "/assets/tools/reactjs.png" },
  "react.js": { type: "image", src: "/assets/tools/reactjs.png" },
  "react js": { type: "image", src: "/assets/tools/reactjs.png" },
  reactjs: { type: "image", src: "/assets/tools/reactjs.png" },
  next: { type: "image", src: "/assets/tools/nextjs.png" },
  "next.js": { type: "image", src: "/assets/tools/nextjs.png" },
  "next js": { type: "image", src: "/assets/tools/nextjs.png" },
  nextjs: { type: "image", src: "/assets/tools/nextjs.png" },
  tailwind: { type: "image", src: "/assets/tools/tailwind.png" },
  "tailwind css": { type: "image", src: "/assets/tools/tailwind.png" },
  tailwindcss: { type: "image", src: "/assets/tools/tailwind.png" },
  bootstrap: { type: "image", src: "/assets/tools/bootstrap.png" },
  js: { type: "image", src: "/assets/tools/js.png" },
  javascript: { type: "image", src: "/assets/tools/js.png" },
  node: { type: "image", src: "/assets/tools/nodejs.png" },
  "node.js": { type: "image", src: "/assets/tools/nodejs.png" },
  "node js": { type: "image", src: "/assets/tools/nodejs.png" },
  nodejs: { type: "image", src: "/assets/tools/nodejs.png" },
  github: { type: "image", src: "/assets/tools/github.png" },
  ai: { type: "image", src: "/assets/tools/ai.png" },
  "adobe illustrator": { type: "image", src: "/assets/tools/ai.png" },
  canva: { type: "image", src: "/assets/tools/canva.png" },
  figma: { type: "image", src: "/assets/tools/figma.png" },
  html: { type: "remixicon", className: "ri-html5-fill text-orange-500" },
  css: { type: "remixicon", className: "ri-css3-fill text-blue-500" },
  git: { type: "remixicon", className: "ri-git-branch-line text-orange-400" },
  database: { type: "remixicon", className: "ri-database-2-line text-violet-400" },
  mysql: { type: "remixicon", className: "ri-database-2-line text-sky-400" },
};

const SOCIAL_ICON_MAP = {
  github: "ri-github-fill",
  linkedin: "ri-linkedin-box-fill",
  instagram: "ri-instagram-line",
  youtube: "ri-youtube-fill",
  twitter: "ri-twitter-x-line",
  x: "ri-twitter-x-line",
  dribbble: "ri-dribbble-line",
  behance: "ri-behance-fill",
  reddit: "ri-reddit-fill",
};

/**
 * Membersihkan nilai string dengan nilai fallback jika kosong.
 */
export function cleanString(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

/**
 * Membersihkan array agar hanya berisi string yang tidak kosong.
 */
export function cleanStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

/**
 * Memvalidasi URL eksternal (http/https).
 */
export function isValidExternalUrl(url) {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Menormalkan path aset/gambar secara cerdas:
 * - Jika ditulis nama file saja (mis. `"avatar.png"` atau `"proyek1.webp"`), otomatis diarahkan ke `/assets/<defaultSubfolder>/...`.
 * - Jika ditulis `/images/...`, otomatis dipetakan ke `/assets/...`.
 * - Jika ditulis `/assets/...` atau URL `https://...`, langsung digunakan.
 */
export function cleanImagePath(rawPath, defaultSubfolder = "") {
  if (typeof rawPath !== "string") return "";
  const trimmed = rawPath.trim();
  if (!trimmed) return "";

  if (isValidExternalUrl(trimmed)) {
    return trimmed;
  }

  // Petakan path lama `/images/...` atau `/public/...` ke `/assets/...`
  const normalized = trimmed
    .replace(/^\/?public\//, "/")
    .replace(/^\/?images\/profile\//, "/assets/")
    .replace(/^\/?images\/projects\//, "/assets/proyek/")
    .replace(/^\/?images\//, "/assets/");

  if (normalized.startsWith("/")) {
    return normalized;
  }

  // Jika pengguna hanya menulis nama file seperti "avatar.png" atau "proyek1.webp"
  if (!normalized.includes("/")) {
    return defaultSubfolder
      ? `/assets/${defaultSubfolder}/${normalized}`
      : `/assets/${normalized}`;
  }

  return `/${normalized.replace(/^\.?\//, "")}`;
}

/**
 * Menyelesaikan ikon skill (mendukung path gambar maupun kode nama tool).
 */
export function resolveSkillIcon(icon, name) {
  const rawIcon = cleanString(icon);
  const rawName = cleanString(name).toLowerCase();

  if (rawIcon.includes("/") || rawIcon.endsWith(".png") || rawIcon.endsWith(".svg") || rawIcon.endsWith(".webp")) {
    return { type: "image", src: cleanImagePath(rawIcon, "tools") };
  }

  const key = rawIcon.toLowerCase();
  if (key && SKILL_ICON_MAP[key]) return SKILL_ICON_MAP[key];
  if (rawName && SKILL_ICON_MAP[rawName]) return SKILL_ICON_MAP[rawName];
  if (key.startsWith("ri-")) return { type: "remixicon", className: rawIcon };

  return { type: "remixicon", className: "ri-code-box-line text-violet-400" };
}

/**
 * Menentukan class RemixIcon berdasarkan nama platform sosial media.
 */
export function getSocialIconClass(platform) {
  const key = cleanString(platform).toLowerCase();
  for (const [name, iconClass] of Object.entries(SOCIAL_ICON_MAP)) {
    if (key.includes(name)) return iconClass;
  }
  return "ri-links-line";
}

/**
 * Normalisasi dan deduplikasi koleksi data (ID & Slug otomatis dibuat jika belum diisi).
 */
function normalizeCollection(list, prefix, slugSourceField, transformItem) {
  if (!Array.isArray(list)) return [];

  const seenIds = new Set();
  const seenSlugs = new Set();

  return list
    .filter((item) => item && typeof item === "object")
    .map((rawItem, index) => {
      const num = String(index + 1).padStart(3, "0");

      let id = cleanString(rawItem.id, `${prefix}-${num}`);
      if (seenIds.has(id)) {
        id = `${id}-${index + 1}`;
      }
      seenIds.add(id);

      let slug = ensureItemSlug(rawItem, slugSourceField) || `${prefix}-${num}`;
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${index + 1}`;
      }
      seenSlugs.add(slug);

      return transformItem({ ...rawItem, id, slug }, index);
    });
}

/* ==========================================================================
   SINGLE SOURCE OF TRUTH — DATA YANG TELAH DINORMALISASI SEKALI SAAT LOAD
   ========================================================================== */

const PROFILE_DATA = (() => {
  const raw = profileRaw && typeof profileRaw === "object" ? profileRaw : {};
  const stats = raw.stats && typeof raw.stats === "object" ? raw.stats : {};
  return {
    name: cleanString(raw.name, "Zabrina Talitha Anindya"),
    quote: cleanString(raw.quote, "Kode Indah lahir dari ketekunan."),
    headline: cleanString(raw.headline, "Web Developer & Designer"),
    description: cleanString(raw.description),
    about: cleanString(raw.about),
    location: cleanString(raw.location),
    avatar: cleanImagePath(raw.avatar) || "/assets/hero-img.webp",
    resume: cleanString(raw.resume),
    stats: {
      projectsCompleted: cleanString(stats.projectsCompleted, "45+"),
      yearsOfExperience: cleanString(stats.yearsOfExperience, "4+"),
    },
  };
})();

const SKILLS_DATA = (() => {
  const rawCategories = Array.isArray(skillsRaw?.categories)
    ? skillsRaw.categories
    : [];

  return normalizeCollection(rawCategories, "skill-cat", "name", (cat) => {
    const name = cleanString(cat.name, "Skills & Tools");
    const rawItems = Array.isArray(cat.items) ? cat.items : [];

    const items = rawItems
      .filter((item) => item && typeof item === "object" && cleanString(item.name))
      .map((item, idx) => {
        const itemName = cleanString(item.name);
        return {
          id: cleanString(item.id, `${cat.id}-item-${idx + 1}`),
          name: itemName,
          icon: cleanString(item.icon),
          role: cleanString(item.role, name),
          iconData: resolveSkillIcon(item.icon, itemName),
        };
      });

    return { id: cat.id, name, items };
  }).filter((cat) => cat.items.length > 0);
})();

const PROJECTS_DATA = normalizeCollection(
  projectsRaw?.projects,
  "project",
  "title",
  (proj) => {
    const thumbnail = cleanImagePath(proj.thumbnail, "proyek");
    const gallery = cleanStringArray(proj.gallery)
      .map((img) => cleanImagePath(img, "proyek"))
      .filter(Boolean);
    const description = cleanString(proj.description, cleanString(proj.shortDescription));
    const shortDescription = cleanString(proj.shortDescription, description);

    return {
      id: proj.id,
      slug: proj.slug,
      title: cleanString(proj.title, "Untitled Project"),
      shortDescription,
      description,
      thumbnail,
      category: cleanString(proj.category, "Web Development"),
      featured: Boolean(proj.featured),
      status: cleanString(proj.status, "Completed"),
      year: proj.year ? Number(proj.year) || cleanString(String(proj.year)) : null,
      role: cleanString(proj.role),
      technologies: cleanStringArray(proj.technologies),
      problem: cleanString(proj.problem),
      solution: cleanString(proj.solution),
      features: cleanStringArray(proj.features),
      contributions: cleanStringArray(proj.contributions),
      gallery: gallery.length > 0 ? gallery : thumbnail ? [thumbnail] : [],
      repositoryUrl: isValidExternalUrl(proj.repositoryUrl) ? proj.repositoryUrl.trim() : "",
      liveUrl: isValidExternalUrl(proj.liveUrl) ? proj.liveUrl.trim() : "",
    };
  }
);

const CERTIFICATIONS_DATA = sortCertificationsByDate(
  normalizeCollection(
    certificationsRaw?.certifications,
    "cert",
    "name",
    (cert) => ({
      id: cert.id,
      slug: cert.slug,
      name: cleanString(cert.name, "Untitled Certification"),
      issuer: cleanString(cert.issuer),
      issueDate: cleanString(cert.issueDate),
      credentialId: cleanString(cert.credentialId),
      credentialUrl: isValidExternalUrl(cert.credentialUrl) ? cert.credentialUrl.trim() : "",
      image: cleanImagePath(cert.image, "certifications"),
      description: cleanString(cert.description),
      skills: cleanStringArray(cert.skills),
      featured: Boolean(cert.featured),
    })
  )
);

const EXPERIENCES_DATA = sortExperiencesByDate(
  normalizeCollection(
    experiencesRaw?.experiences,
    "exp",
    "position",
    (exp) => {
      const description = cleanString(exp.description, cleanString(exp.shortDescription));
      const shortDescription = cleanString(exp.shortDescription, description);
      return {
        id: exp.id,
        slug: exp.slug,
        organization: cleanString(exp.organization, "Organisasi"),
        position: cleanString(exp.position, "Posisi"),
        type: cleanString(exp.type, "Work Experience"),
        location: cleanString(exp.location),
        employmentType: cleanString(exp.employmentType),
        startDate: cleanString(exp.startDate),
        endDate: cleanString(exp.endDate),
        current: Boolean(exp.current),
        shortDescription,
        description,
        responsibilities: cleanStringArray(exp.responsibilities),
        achievements: cleanStringArray(exp.achievements),
        technologies: cleanStringArray(exp.technologies),
        logo: cleanImagePath(exp.logo, "experiences"),
        featured: Boolean(exp.featured),
      };
    }
  )
);

const CONTACT_DATA = (() => {
  const raw = contactRaw && typeof contactRaw === "object" ? contactRaw : {};
  const rawSocials = Array.isArray(raw.socials) ? raw.socials : [];

  const socials = rawSocials
    .filter((item) => item && typeof item === "object" && cleanString(item.platform))
    .map((item, idx) => {
      const platform = cleanString(item.platform);
      const url = isValidExternalUrl(item.url) ? item.url.trim() : "";
      return {
        id: `social-${idx + 1}-${platform.toLowerCase()}`,
        platform,
        username: cleanString(item.username, platform),
        url,
        iconClass: getSocialIconClass(platform),
      };
    })
    .filter((item) => Boolean(item.url));

  return {
    email: cleanString(raw.email),
    socials,
  };
})();

const NAVIGATION_DATA = (() => {
  const rawMenus = Array.isArray(navigationRaw?.menus) ? navigationRaw.menus : [];
  const menus = rawMenus
    .filter((m) => m && typeof m === "object" && cleanString(m.label) && cleanString(m.path))
    .map((m) => ({
      label: cleanString(m.label),
      path: cleanString(m.path),
    }));

  return menus.length > 0
    ? menus
    : [
        { label: "Home", path: "/" },
        { label: "Projects", path: "/projects" },
        { label: "Certifications", path: "/certifications" },
        { label: "Experience", path: "/experience" },
        { label: "Contact", path: "/contact" },
      ];
})();

/* ==========================================================================
   PUBLIC GETTERS UNTUK KOMPONEN & HALAMAN
   ========================================================================== */

export const getProfile = () => PROFILE_DATA;

export const getSkills = () => SKILLS_DATA;

export const getFlatSkills = () =>
  SKILLS_DATA.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryName: category.name,
      categoryId: category.id,
    }))
  );

export const getAllProjects = () => PROJECTS_DATA;

export const getFeaturedProjects = (limit = 3) => {
  const maxLimit = Math.min(Math.max(Number(limit) || 3, 1), 3);
  return PROJECTS_DATA.filter((proj) => proj.featured).slice(0, maxLimit);
};

export const getProjectBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return target ? PROJECTS_DATA.find((proj) => proj.slug === target) || null : null;
};

export const getProjectCategories = () => [
  "Semua",
  ...new Set(PROJECTS_DATA.map((proj) => proj.category).filter(Boolean)),
];

export const getAllCertifications = () => CERTIFICATIONS_DATA;

export const getFeaturedCertifications = (limit = 3) =>
  CERTIFICATIONS_DATA.filter((cert) => cert.featured).slice(0, limit);

export const getCertificationBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return target ? CERTIFICATIONS_DATA.find((cert) => cert.slug === target) || null : null;
};

export const getAllExperiences = () => EXPERIENCES_DATA;

export const getFeaturedExperiences = (limit = 3) =>
  EXPERIENCES_DATA.filter((exp) => exp.featured).slice(0, limit);

export const getExperienceBySlug = (slug) => {
  const target = normalizeSlug(slug);
  return target ? EXPERIENCES_DATA.find((exp) => exp.slug === target) || null : null;
};

export const getContact = () => CONTACT_DATA;

export const getNavigation = () => NAVIGATION_DATA;
