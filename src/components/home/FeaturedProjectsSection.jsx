import { getFeaturedProjects } from "../../utils/dataHelpers.js";
import ProjectCard from "../projects/ProjectCard.jsx";
import SectionHeader from "../shared/SectionHeader.jsx";
import EmptyState from "../shared/EmptyState.jsx";

const FeaturedProjectsSection = () => {
  const featuredProjects = getFeaturedProjects(3);

  return (
    <section className="proyek mt-32" id="featured-projects">
      <SectionHeader
        title="Proyek Unggulan"
        subtitle="Berikut ini beberapa proyek pilihan yang telah saya kembangkan."
        actionLabel="Lihat Semua Proyek"
        actionTo="/projects"
      />

      {featuredProjects.length === 0 ? (
        <EmptyState
          icon="ri-folder-open-line"
          title="Belum Ada Proyek Unggulan"
          description="Tandai proyek dengan featured: true pada projects.json untuk menampilkannya di beranda."
        />
      ) : (
        <div className="proyek-box grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProjectsSection;
