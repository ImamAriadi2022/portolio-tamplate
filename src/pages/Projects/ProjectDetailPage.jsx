import { useState } from "react";
import { getProjectBySlug } from "../../utils/dataHelpers.js";
import AppLink from "../../components/shared/AppLink.jsx";
import SafeImage from "../../components/shared/SafeImage.jsx";
import NotFoundState from "../../components/shared/NotFoundState.jsx";

const ProjectDetailPage = ({ slug }) => {
  const project = getProjectBySlug(slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!project) {
    return (
      <NotFoundState
        title="Proyek Tidak Ditemukan"
        description={`Proyek dengan identifier "${slug || ""}" tidak ditemukan dalam daftar portofolio.`}
        backTo="/projects"
        backLabel="Kembali ke Daftar Proyek"
      />
    );
  }

  const galleryImages =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.thumbnail
      ? [project.thumbnail]
      : [];

  const activeImage =
    galleryImages[selectedImageIndex] || galleryImages[0] || project.thumbnail;

  return (
    <article className="pt-8 pb-16">
      <div className="mb-8">
        <AppLink
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <i className="ri-arrow-left-line ri-lg"></i>
          <span>Kembali ke Daftar Proyek</span>
        </AppLink>
      </div>

      <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl p-6 sm:p-10 mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {project.category && (
            <span className="bg-violet-700/20 text-violet-300 border border-violet-500/30 text-xs font-semibold px-3 py-1 rounded-lg">
              {project.category}
            </span>
          )}
          {project.status && (
            <span className="bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1 rounded-lg">
              {project.status}
            </span>
          )}
          {project.year && (
            <span className="bg-zinc-700/60 text-zinc-300 text-xs font-medium px-3 py-1 rounded-lg">
              Tahun {project.year}
            </span>
          )}
          {project.featured && (
            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-medium px-3 py-1 rounded-lg">
              Featured Project
            </span>
          )}
        </div>

        <h1 className="sm:text-4xl/tight text-2xl/tight font-bold mb-4">
          {project.title}
        </h1>

        {project.role && (
          <p className="text-sm sm:text-base text-zinc-300 mb-6 flex items-center gap-2">
            <i className="ri-user-star-line text-violet-400"></i>
            <span>Peran:</span>
            <strong className="font-semibold text-white">{project.role}</strong>
          </p>
        )}

        {activeImage && (
          <div className="mb-6">
            <div className="overflow-hidden rounded-xl bg-zinc-900 border border-zinc-700/60 max-h-[520px] flex items-center justify-center">
              <SafeImage
                src={activeImage}
                alt={project.title}
                className="w-full max-h-[520px] object-cover"
                fallbackClassName="w-full h-72"
                fallbackText="Gambar dokumentasi tidak tersedia"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={`${project.id}-gallery-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      idx === selectedImageIndex
                        ? "border-violet-500 opacity-100"
                        : "border-zinc-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <SafeImage
                      src={imgSrc}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {project.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Deskripsi Proyek</h2>
            <p className="text-base/loose opacity-75">{project.description}</p>
          </div>
        )}

        {(project.problem || project.solution) && (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-8">
            {project.problem && (
              <div className="bg-zinc-900/70 border border-zinc-700/60 p-5 rounded-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-zinc-100">
                  <i className="ri-question-line text-violet-400"></i>
                  <span>Permasalahan</span>
                </h3>
                <p className="text-sm/relaxed opacity-75">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="bg-zinc-900/70 border border-zinc-700/60 p-5 rounded-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-zinc-100">
                  <i className="ri-lightbulb-flash-line text-violet-400"></i>
                  <span>Solusi</span>
                </h3>
                <p className="text-sm/relaxed opacity-75">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          {project.features && project.features.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <i className="ri-list-check-2 text-violet-400"></i>
                <span>Fitur Utama</span>
              </h2>
              <ul className="space-y-2.5">
                {project.features.map((feature, idx) => (
                  <li
                    key={`${project.id}-feat-${idx}`}
                    className="flex items-start gap-2.5 text-sm/relaxed opacity-80"
                  >
                    <i className="ri-checkbox-circle-line text-violet-400 mt-1 shrink-0"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.contributions && project.contributions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <i className="ri-git-commit-line text-violet-400"></i>
                <span>Kontribusi</span>
              </h2>
              <ul className="space-y-2.5">
                {project.contributions.map((contribution, idx) => (
                  <li
                    key={`${project.id}-contrib-${idx}`}
                    className="flex items-start gap-2.5 text-sm/relaxed opacity-80"
                  >
                    <i className="ri-arrow-right-s-line text-violet-400 mt-1 shrink-0"></i>
                    <span>{contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Teknologi yang Digunakan</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={`${project.id}-detail-tech-${idx}`}
                  className="py-1.5 px-3.5 border border-zinc-600 bg-zinc-700/60 rounded-lg text-sm font-semibold text-zinc-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.liveUrl || project.repositoryUrl) && (
          <div className="pt-6 border-t border-zinc-700/70 flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-violet-700 hover:bg-violet-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
              >
                <span>Lihat Demo Proyek</span>
                <i className="ri-external-link-line ri-lg"></i>
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
              >
                <i className="ri-github-fill ri-lg"></i>
                <span>Kode Sumber (Repository)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectDetailPage;
