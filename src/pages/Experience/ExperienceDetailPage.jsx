import { getExperienceBySlug } from "../../utils/dataHelpers.js";
import { formatExperiencePeriod } from "../../utils/sorting.js";
import AppLink from "../../components/shared/AppLink.jsx";
import SafeImage from "../../components/shared/SafeImage.jsx";
import NotFoundState from "../../components/shared/NotFoundState.jsx";

const ExperienceDetailPage = ({ slug }) => {
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    return (
      <NotFoundState
        title="Pengalaman Tidak Ditemukan"
        description={`Data pengalaman dengan identifier "${slug || ""}" tidak ditemukan.`}
        backTo="/experience"
        backLabel="Kembali ke Daftar Pengalaman"
      />
    );
  }

  const periodLabel = formatExperiencePeriod(
    experience.startDate,
    experience.endDate,
    experience.current
  );

  return (
    <article className="pt-8 pb-16">
      <div className="mb-8">
        <AppLink
          to="/experience"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <i className="ri-arrow-left-line ri-lg"></i>
          <span>Kembali ke Daftar Pengalaman</span>
        </AppLink>
      </div>

      <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 mb-8 border-b border-zinc-700/70">
          <div className="flex items-start gap-4">
            {experience.logo && (
              <SafeImage
                src={experience.logo}
                alt={experience.organization}
                hideOnEmpty
                hideOnError
                className="w-16 h-16 rounded-2xl object-contain bg-zinc-900 p-2 border border-zinc-700 shrink-0"
              />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                {experience.type && (
                  <span className="bg-violet-700/20 text-violet-300 border border-violet-500/30 text-xs font-semibold px-3 py-1 rounded-lg">
                    {experience.type}
                  </span>
                )}
                {experience.employmentType && (
                  <span className="bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1 rounded-lg">
                    {experience.employmentType}
                  </span>
                )}
                {experience.current && (
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-lg">
                    Masih Berlangsung (Current)
                  </span>
                )}
              </div>

              <h1 className="sm:text-3xl/tight text-2xl/tight font-bold mb-1">
                {experience.position}
              </h1>
              <p className="text-lg font-medium text-zinc-300">
                {experience.organization}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 text-sm text-zinc-300 shrink-0">
            {periodLabel && (
              <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-700 px-4 py-2 rounded-xl font-medium">
                <i className="ri-calendar-line text-violet-400"></i>
                <span>{periodLabel}</span>
              </div>
            )}
            {experience.location && (
              <div className="inline-flex items-center gap-1.5 text-zinc-400">
                <i className="ri-map-pin-line text-violet-400"></i>
                <span>{experience.location}</span>
              </div>
            )}
          </div>
        </div>

        {experience.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Ringkasan Pengalaman</h2>
            <p className="text-base/loose opacity-75">
              {experience.description}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          {experience.responsibilities && experience.responsibilities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="ri-task-line text-violet-400"></i>
                <span>Tanggung Jawab</span>
              </h2>
              <ul className="space-y-3">
                {experience.responsibilities.map((item, idx) => (
                  <li
                    key={`${experience.id}-resp-${idx}`}
                    className="flex items-start gap-2.5 text-sm/relaxed opacity-80"
                  >
                    <i className="ri-checkbox-circle-line text-violet-400 mt-1 shrink-0"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.achievements && experience.achievements.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="ri-trophy-line text-violet-400"></i>
                <span>Pencapaian Utama</span>
              </h2>
              <ul className="space-y-3">
                {experience.achievements.map((item, idx) => (
                  <li
                    key={`${experience.id}-ach-${idx}`}
                    className="flex items-start gap-2.5 text-sm/relaxed opacity-80"
                  >
                    <i className="ri-medal-line text-violet-400 mt-1 shrink-0"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {experience.technologies && experience.technologies.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3">Teknologi & Tools</h2>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, idx) => (
                <span
                  key={`${experience.id}-detail-tech-${idx}`}
                  className="py-1.5 px-3.5 border border-zinc-600 bg-zinc-700/60 rounded-lg text-sm font-semibold text-zinc-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ExperienceDetailPage;
