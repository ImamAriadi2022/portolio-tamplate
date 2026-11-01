const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const INDONESIAN_SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/**
 * Mengubah string tanggal (YYYY, YYYY-MM, atau YYYY-MM-DD) menjadi timestamp numerik untuk pengurutan.
 * @param {string|number} dateInput
 * @returns {number}
 */
export function parseDateToTimestamp(dateInput) {
  if (dateInput === null || dateInput === undefined || dateInput === "") {
    return 0;
  }
  if (typeof dateInput === "number" && !Number.isNaN(dateInput)) {
    return new Date(`${dateInput}-01-01T00:00:00Z`).getTime() || dateInput;
  }
  const str = String(dateInput).trim();
  if (!str) return 0;

  if (/^\d{4}$/.test(str)) {
    return new Date(`${str}-01-01T00:00:00Z`).getTime() || 0;
  }
  if (/^\d{4}-\d{2}$/.test(str)) {
    return new Date(`${str}-01T00:00:00Z`).getTime() || 0;
  }
  const parsed = Date.parse(str);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Mengurutkan daftar pengalaman berdasarkan tanggal terbaru secara default.
 * @param {Array<Record<string, any>>} experiences
 * @returns {Array<Record<string, any>>}
 */
export function sortExperiencesByDate(experiences) {
  if (!Array.isArray(experiences)) return [];
  return [...experiences].sort((a, b) => {
    const startA = parseDateToTimestamp(a?.startDate);
    const startB = parseDateToTimestamp(b?.startDate);
    if (startB !== startA) {
      return startB - startA;
    }
    if (Boolean(a?.current) !== Boolean(b?.current)) {
      return a?.current ? -1 : 1;
    }
    const endA = a?.current ? Number.MAX_SAFE_INTEGER : parseDateToTimestamp(a?.endDate);
    const endB = b?.current ? Number.MAX_SAFE_INTEGER : parseDateToTimestamp(b?.endDate);
    return endB - endA;
  });
}

/**
 * Mengurutkan daftar sertifikasi berdasarkan tanggal terbit terbaru.
 * @param {Array<Record<string, any>>} certifications
 * @returns {Array<Record<string, any>>}
 */
export function sortCertificationsByDate(certifications) {
  if (!Array.isArray(certifications)) return [];
  return [...certifications].sort((a, b) => {
    const dateA = parseDateToTimestamp(a?.issueDate);
    const dateB = parseDateToTimestamp(b?.issueDate);
    return dateB - dateA;
  });
}

/**
 * Mengurutkan daftar project berdasarkan tahun terbaru sambil mempertahankan urutan asli jika tahun sama.
 * @param {Array<Record<string, any>>} projects
 * @returns {Array<Record<string, any>>}
 */
export function sortProjectsByDate(projects) {
  if (!Array.isArray(projects)) return [];
  return [...projects]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const yearA = Number(a.item?.year) || 0;
      const yearB = Number(b.item?.year) || 0;
      if (yearB !== yearA) {
        return yearB - yearA;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

/**
 * Memformat string tanggal YYYY-MM-DD atau YYYY-MM ke bahasa Indonesia.
 * @param {string} dateStr
 * @param {boolean} shortMonth
 * @returns {string}
 */
export function formatDateIndo(dateStr, shortMonth = false) {
  if (typeof dateStr !== "string" || !dateStr.trim()) return "";
  const clean = dateStr.trim();
  const months = shortMonth ? INDONESIAN_SHORT_MONTHS : INDONESIAN_MONTHS;

  if (/^\d{4}$/.test(clean)) {
    return clean;
  }

  const ymMatch = clean.match(/^(\d{4})-(\d{2})$/);
  if (ymMatch) {
    const year = ymMatch[1];
    const monthIdx = parseInt(ymMatch[2], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${year}`;
    }
    return clean;
  }

  const ymdMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const monthIdx = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${months[monthIdx]} ${year}`;
    }
    return clean;
  }

  return clean;
}

/**
 * Memformat rentang periode pengalaman kerja/organisasi.
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} current
 * @returns {string}
 */
export function formatExperiencePeriod(startDate, endDate, current = false) {
  const startLabel = formatDateIndo(startDate, true);
  const endLabel = current ? "Sekarang" : formatDateIndo(endDate, true);

  if (startLabel && endLabel) {
    return `${startLabel} — ${endLabel}`;
  }
  if (startLabel) {
    return current ? `${startLabel} — Sekarang` : startLabel;
  }
  if (endLabel) {
    return endLabel;
  }
  return "";
}
