import { useState, useMemo } from "react";
import { getAllProjects, getProjectCategories } from "../../utils/dataHelpers.js";
import ProjectCard from "../../components/projects/ProjectCard.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

const ProjectsPage = () => {
  const allProjects = getAllProjects();
  const categories = getProjectCategories();
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Semua") {
      return allProjects;
    }
    return allProjects.filter((proj) => proj.category === selectedCategory);
  }, [allProjects, selectedCategory]);

  return (
    <section className="pt-8 pb-16">
      <div className="mb-10">
        <h1 className="sm:text-4xl/snug text-3xl/snug font-bold mb-3">
          Semua Proyek
        </h1>
        <p className="text-base/loose opacity-60 max-w-2xl">
          Daftar lengkap proyek pengembangan website, aplikasi web, dan desain produk digital yang telah saya kerjakan.
        </p>
      </div>

      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-violet-700 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/60"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon="ri-folder-open-line"
          title="Proyek Tidak Ditemukan"
          description="Belum ada proyek pada kategori yang dipilih."
        />
      ) : (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsPage;
