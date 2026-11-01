import profileRaw from "../../data/profile.json" with { type: "json" };
import skillsRaw from "../../data/skills.json" with { type: "json" };
import projectsRaw from "../../data/projects.json" with { type: "json" };
import certificationsRaw from "../../data/certifications.json" with { type: "json" };
import experiencesRaw from "../../data/experiences.json" with { type: "json" };
import contactRaw from "../../data/contact.json" with { type: "json" };
import navigationRaw from "../../data/navigation.json" with { type: "json" };

import { ensureItemSlug, normalizeSlug } from "./slug.js";
import {
  sortCertificationsByDate,
  sortExperiencesByDate,
} from "./sorting.js";

/**
 * Peta ikon bawaan untuk mencocokkan nama ikon/tool dengan gambar yang tersedia di public/assets/tools
 * atau fallback RemixIcon jika pengguna menambahkan skill baru dengan kode nama ikon.
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

/**
 * Memastikan nilai string bersih dan aman digunakan.
 * @param {any} value
 * @param {string} fallback
 * @returns {string}
 */
export function cleanString(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

/**
 * Memastikan array string hanya berisi nilai string yang tidak kosong.
 * @param {any} arr
 * @returns {string[]}
 */
export function cleanStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

/**
 * Memvalidasi apakah URL eksternal valid (http:// atau https://).
 * @param {any} url
 * @returns {boolean}
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
 * Memvalidasi path gambar atau URL gambar.
 * @param {any} path
 * @returns {string}
 */
export function cleanImagePath(path) {
  if (typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || isValidExternalUrl(trimmed)) {
    return trimmed;
  }
  return `/${trimmed.replace(/^\.?\//, "")}`;
}

/**
 * Menyelesaikan representasi ikon untuk item skill.
 * @param {string} icon
 * @param {string} name
 * @returns {{ type: 'image' | 'remixicon', src?: string, className?: string }}
 */
export function resolveSkillIcon(icon, name) {
  const rawIcon = cleanString(icon);
  const rawName = cleanString(name).toLowerCase();

  if (rawIcon.startsWith("/") || isValidExternalUrl(rawIcon)) {
    return { type: "image", src: rawIcon };
  }

  const key = rawIcon.toLowerCase();
  if (key && SKILL_ICON_MAP[key]) {
    return SKILL_ICON_MAP[key];
  }
  if (rawName && SKILL_ICON_MAP[rawName]) {
    return SKILL_ICON_MAP[rawName];
  }
  if (key.startsWith("ri-")) {
    return { type: "remixicon", className: rawIcon };
  }

  return { type: "remixicon", className: "ri-code-box-line text-violet-400" };
}

/**
 * Validasi dan deduplikasi koleksi item berdasarkan ID dan slug tanpa mengubah file sumber.
 * @param {any} list
 * @param {string} categoryLabel
 * @param {string} fallbackSlugField
 * @returns {Array<Record<string, any>>}
 */
function validateCollection(list, categoryLabel, fallbackSlugField = "title") {
  if (!Array.isArray(list)) {
    console.warn(`[dataHelpers] Koleksi "${categoryLabel}" bukan array yang valid.`);
    return [];
  }

  const seenIds = new Set();
  const seenSlugs = new Set();
  const validated = [];

  list.forEach((rawItem, index) => {
    if (!rawItem || typeof rawItem !== "object") {
      console.warn(`[dataHelpers] Item tidak valid pada "${categoryLabel}" indeks ${index}.`);
      return;
    }

    let id = cleanString(rawItem.id, `${categoryLabel}-${index + 1}`);
    if (seenIds.has(id)) {
      console.warn(`[dataHelpers] Duplikasi ID "${id}" terdeteksi pada "${categoryLabel}".`);
      id = `${id}-${index + 1}`;
    }
    seenIds.add(id);

    let slug = ensureItemSlug(rawItem, fallbackSlugField);
    if (!slug) {
      slug = `${categoryLabel}-${index + 1}`;
    }
    if (seenSlugs.has(slug)) {
      console.warn(`[dataHelpers] Duplikasi slug "${slug}" terdeteksi pada "${categoryLabel}".`);
      slug = `${slug}-${index + 1}`;
    }
    seenSlugs.add(slug);

    validated.push({
      ...rawItem,
      id,
      slug,
    });
  });

  return validated;
}

/**
 * Mengambil data profil dari data/profile.json.
 */
export function getProfile() {
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
}

/**
 * Mengambil kategori dan daftar keahlian dari data/skills.json.
 */
export function getSkills() {
  const rawCategories =
    skillsRaw && typeof skillsRaw === "object" && Array.isArray(skillsRaw.categories)
      ? skillsRaw.categories
      : [];

  const seenCategoryIds = new Set();

  return rawCategories
    .filter((cat) => cat && typeof cat === "object")
    .map((cat, idx) => {
      let id = cleanString(cat.id, `skill-cat-${idx + 1}`);
      if (seenCategoryIds.has(id)) {
        id = `${id}-${idx + 1}`;
      }
      seenCategoryIds.add(id);

      const name = cleanString(cat.name, "Skills & Tools");
      const rawItems = Array.isArray(cat.items) ? cat.items : [];

      const items = rawItems
        .filter((item) => item && typeof item === "object" && cleanString(item.name))
        .map((item, itemIdx) => {
          const itemName = cleanString(item.name);
          const role = cleanString(item.role, name);
          const iconData = resolveSkillIcon(item.icon, itemName);
          return {
            id: cleanString(item.id, `${id}-item-${itemIdx + 1}`),
            name: itemName,
            icon: cleanString(item.icon),
            role,
            iconData,
          };
        });

      return {
        id,
        name,
        items,
      };
    })
    .filter((cat) => cat.items.length > 0);
}

/**
 * Mengambil seluruh item keahlian secara mendatar (flat array).
 */
export function getFlatSkills() {
  const categories = getSkills();
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryName: category.name,
      categoryId: category.id,
    }))
  );
}

/**
 * Mengambil seluruh daftar project yang telah divalidasi dari data/projects.json.
 */
export function getAllProjects() {
  const rawList =
    projectsRaw && typeof projectsRaw === "object" && Array.isArray(projectsRaw.projects)
      ? projectsRaw.projects
      : [];

  const validated = validateCollection(rawList, "project", "title").map((proj) => {
    const thumbnail = cleanImagePath(proj.thumbnail);
    const gallery = cleanStringArray(proj.gallery)
      .map((img) => cleanImagePath(img))
      .filter(Boolean);

    return {
      id: proj.id,
      slug: proj.slug,
      title: cleanString(proj.title, "Untitled Project"),
      shortDescription: cleanString(proj.shortDescription, cleanString(proj.description)),
      description: cleanString(proj.description, cleanString(proj.shortDescription)),
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
  });

  return validated;
}

/**
 * Mengambil project unggulan untuk ditampilkan di halaman Home (maksimal 3).
 * @param {number} limit
 */
export function getFeaturedProjects(limit = 3) {
  const maxLimit = Math.min(Math.max(Number(limit) || 3, 1), 3);
  return getAllProjects()
    .filter((proj) => proj.featured)
    .slice(0, maxLimit);
}

/**
 * Mengambil detail project berdasarkan slug.
 * @param {string} slug
 */
export function getProjectBySlug(slug) {
  const target = normalizeSlug(slug);
  if (!target) return null;
  return getAllProjects().find((proj) => proj.slug === target) || null;
}

/**
 * Mengambil daftar kategori unik dari seluruh project.
 */
export function getProjectCategories() {
  const projects = getAllProjects();
  const categories = new Set();
  projects.forEach((proj) => {
    if (proj.category) {
      categories.add(proj.category);
    }
  });
  return ["Semua", ...Array.from(categories)];
}

/**
 * Mengambil seluruh daftar sertifikasi dari data/certifications.json (diurutkan terbaru).
 */
export function getAllCertifications() {
  const rawList =
    certificationsRaw &&
    typeof certificationsRaw === "object" &&
    Array.isArray(certificationsRaw.certifications)
      ? certificationsRaw.certifications
      : [];

  const validated = validateCollection(rawList, "certification", "name").map((cert) => ({
    id: cert.id,
    slug: cert.slug,
    name: cleanString(cert.name, "Untitled Certification"),
    issuer: cleanString(cert.issuer),
    issueDate: cleanString(cert.issueDate),
    credentialId: cleanString(cert.credentialId),
    credentialUrl: isValidExternalUrl(cert.credentialUrl) ? cert.credentialUrl.trim() : "",
    image: cleanImagePath(cert.image),
    description: cleanString(cert.description),
    skills: cleanStringArray(cert.skills),
    featured: Boolean(cert.featured),
  }));

  return sortCertificationsByDate(validated);
}

/**
 * Mengambil sertifikasi unggulan untuk halaman Home.
 * @param {number} limit
 */
export function getFeaturedCertifications(limit = 3) {
  return getAllCertifications()
    .filter((cert) => cert.featured)
    .slice(0, limit);
}

/**
 * Mengambil detail sertifikasi berdasarkan slug.
 * @param {string} slug
 */
export function getCertificationBySlug(slug) {
  const target = normalizeSlug(slug);
  if (!target) return null;
  return getAllCertifications().find((cert) => cert.slug === target) || null;
}

/**
 * Mengambil seluruh daftar pengalaman dari data/experiences.json (diurutkan tanggal terbaru).
 */
export function getAllExperiences() {
  const rawList =
    experiencesRaw &&
    typeof experiencesRaw === "object" &&
    Array.isArray(experiencesRaw.experiences)
      ? experiencesRaw.experiences
      : [];

  const validated = validateCollection(rawList, "experience", "position").map((exp) => ({
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
    shortDescription: cleanString(exp.shortDescription, cleanString(exp.description)),
    description: cleanString(exp.description, cleanString(exp.shortDescription)),
    responsibilities: cleanStringArray(exp.responsibilities),
    achievements: cleanStringArray(exp.achievements),
    technologies: cleanStringArray(exp.technologies),
    logo: cleanImagePath(exp.logo),
    featured: Boolean(exp.featured),
  }));

  return sortExperiencesByDate(validated);
}

/**
 * Mengambil pengalaman unggulan untuk halaman Home.
 * @param {number} limit
 */
export function getFeaturedExperiences(limit = 3) {
  return getAllExperiences()
    .filter((exp) => exp.featured)
    .slice(0, limit);
}

/**
 * Mengambil detail pengalaman berdasarkan slug.
 * @param {string} slug
 */
export function getExperienceBySlug(slug) {
  const target = normalizeSlug(slug);
  if (!target) return null;
  return getAllExperiences().find((exp) => exp.slug === target) || null;
}

/**
 * Mengambil informasi kontak dari data/contact.json.
 */
export function getContact() {
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
}

/**
 * Menentukan class RemixIcon berdasarkan nama platform sosial media.
 * @param {string} platform
 * @returns {string}
 */
export function getSocialIconClass(platform) {
  const key = cleanString(platform).toLowerCase();
  if (key.includes("github")) return "ri-github-fill";
  if (key.includes("linkedin")) return "ri-linkedin-box-fill";
  if (key.includes("instagram")) return "ri-instagram-line";
  if (key.includes("youtube")) return "ri-youtube-fill";
  if (key.includes("twitter") || key === "x") return "ri-twitter-x-line";
  if (key.includes("dribbble")) return "ri-dribbble-line";
  if (key.includes("behance")) return "ri-behance-fill";
  if (key.includes("reddit")) return "ri-reddit-fill";
  return "ri-links-line";
}

/**
 * Mengambil konfigurasi menu navigasi dari data/navigation.json.
 */
export function getNavigation() {
  const rawMenus =
    navigationRaw && typeof navigationRaw === "object" && Array.isArray(navigationRaw.menus)
      ? navigationRaw.menus
      : [];

  const menus = rawMenus
    .filter((menu) => menu && typeof menu === "object" && cleanString(menu.label) && cleanString(menu.path))
    .map((menu) => ({
      label: cleanString(menu.label),
      path: cleanString(menu.path),
    }));

  if (menus.length === 0) {
    return [
      { label: "Home", path: "/" },
      { label: "Projects", path: "/projects" },
      { label: "Certifications", path: "/certifications" },
      { label: "Experience", path: "/experience" },
      { label: "Contact", path: "/contact" },
    ];
  }

  return menus;
}
