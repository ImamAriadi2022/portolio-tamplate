/**
 * Mengubah teks menjadi format slug URL-safe.
 * @param {string} text
 * @returns {string}
 */
export function toSlug(text) {
  if (typeof text !== "string" || !text.trim()) {
    return "";
  }
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "-")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Menormalkan slug dari parameter URL atau input data.
 * @param {string} slug
 * @returns {string}
 */
export function normalizeSlug(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    return "";
  }
  try {
    return toSlug(decodeURIComponent(slug));
  } catch {
    return toSlug(slug);
  }
}

/**
 * Memastikan setiap item memiliki slug yang valid berdasarkan properti slug, title, name, atau id.
 * @param {Record<string, any>} item
 * @param {string} fallbackKey
 * @returns {string}
 */
export function ensureItemSlug(item, fallbackKey = "title") {
  if (!item || typeof item !== "object") {
    return "";
  }
  if (typeof item.slug === "string" && item.slug.trim()) {
    return normalizeSlug(item.slug);
  }
  if (typeof item[fallbackKey] === "string" && item[fallbackKey].trim()) {
    return toSlug(item[fallbackKey]);
  }
  if (typeof item.name === "string" && item.name.trim()) {
    return toSlug(item.name);
  }
  if (typeof item.id === "string" && item.id.trim()) {
    return toSlug(item.id);
  }
  return "";
}
