import AppLink from "../shared/AppLink.jsx";
import SafeImage from "../shared/SafeImage.jsx";
import { formatExperiencePeriod } from "../../utils/sorting.js";

/**
 * Kartu pengalaman kerja/organisasi reusable untuk halaman Home dan halaman Experience.
 * Seluruh item dapat diklik untuk membuka halaman detail (/experience/[slug]).
 */
const ExperienceCard = ({ experience }) => {
  if (!experience) return null;

  const detailUrl = `/experience/${experience.slug}`;
  const periodLabel = formatExperiencePeriod(
    experience.startDate,
    experience.endDate,
    experience.current
  );

  return (
    <AppLink
      to={detailUrl}
      className="group block bg-zinc-800 p-6 rounded-2xl border border-zinc-700/60 hover:border-violet-500/60 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          {experience.logo && (
            <SafeImage
              src={experience.logo}
              alt={experience.organization}
              hideOnEmpty
              hideOnError
              className="w-12 h-12 rounded-xl object-contain bg-zinc-900 p-1.5 border border-zinc-700 shrink-0"
            />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-bold group-hover:text-violet-400 transition-colors">
                {experience.position}
              </h3>
              {experience.current && (
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-zinc-300">
              {experience.organization}
              {experience.location ? ` • ${experience.location}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
          {periodLabel && (
            <span className="text-xs font-medium bg-zinc-700/70 text-zinc-200 px-3 py-1 rounded-lg">
              {periodLabel}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            {experience.type && <span>{experience.type}</span>}
            {experience.type && experience.employmentType && <span>•</span>}
            {experience.employmentType && <span>{experience.employmentType}</span>}
          </div>
        </div>
      </div>

      {experience.shortDescription && (
        <p className="text-sm/relaxed opacity-60 mb-4">
          {experience.shortDescription}
        </p>
      )}

      {experience.technologies && experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.technologies.map((tech, idx) => (
            <span
              key={`${experience.id}-tech-${idx}`}
              className="py-1 px-3 border border-zinc-600 bg-zinc-700/50 rounded-md text-xs font-semibold text-zinc-200"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-zinc-700/60 flex items-center justify-between text-sm font-medium text-violet-400 group-hover:text-violet-300">
        <span>Lihat Detail Pengalaman</span>
        <i className="ri-arrow-right-up-line ri-lg"></i>
      </div>
    </AppLink>
  );
};

export default ExperienceCard;
