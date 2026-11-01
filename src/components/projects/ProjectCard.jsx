import AppLink from "../shared/AppLink.jsx";
import SafeImage from "../shared/SafeImage.jsx";

/**
 * Kartu project reusable yang digunakan di halaman Home dan halaman Projects.
 * Seluruh kartu dapat diklik menuju halaman detail (/projects/[slug]).
 */
const ProjectCard = ({ project }) => {
  if (!project) return null;

  const detailUrl = `/projects/${project.slug}`;

  return (
    <AppLink
      to={detailUrl}
      className="group bg-zinc-800 p-4 rounded-2xl border border-zinc-700/60 hover:border-violet-500/60 transition-all flex flex-col justify-between"
    >
      <div>
        <div className="overflow-hidden rounded-xl bg-zinc-900 aspect-video mb-4 relative">
          <SafeImage
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackClassName="w-full h-full"
            fallbackText="Pratinjau Proyek"
          />
          {project.category && (
            <span className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-sm text-zinc-200 text-xs font-medium px-3 py-1 rounded-lg border border-zinc-700">
              {project.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold group-hover:text-violet-400 transition-colors">
            {project.title}
          </h3>
          {project.year && (
            <span className="text-xs font-medium text-zinc-400 bg-zinc-700/60 px-2.5 py-1 rounded-md shrink-0">
              {project.year}
            </span>
          )}
        </div>

        {project.shortDescription && (
          <p className="text-sm/relaxed opacity-60 mb-4 line-clamp-2">
            {project.shortDescription}
          </p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, idx) => (
              <span
                key={`${project.id}-tech-${idx}`}
                className="py-1 px-3 border border-zinc-600 bg-zinc-700/50 rounded-md text-xs font-semibold text-zinc-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-zinc-700/60 flex items-center justify-between text-sm font-medium text-violet-400 group-hover:text-violet-300">
        <span>Lihat Detail Proyek</span>
        <i className="ri-arrow-right-up-line ri-lg"></i>
      </div>
    </AppLink>
  );
};

export default ProjectCard;
