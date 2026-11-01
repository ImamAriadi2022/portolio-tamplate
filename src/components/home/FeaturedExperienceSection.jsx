import { getFeaturedExperiences } from "../../utils/dataHelpers.js";
import ExperienceCard from "../experience/ExperienceCard.jsx";
import SectionHeader from "../shared/SectionHeader.jsx";
import EmptyState from "../shared/EmptyState.jsx";

const FeaturedExperienceSection = () => {
  const featuredExperiences = getFeaturedExperiences(3);

  return (
    <section className="pengalaman mt-32" id="featured-experience">
      <SectionHeader
        title="Pengalaman Unggulan"
        subtitle="Rekam jejak karier profesional, proyek lepas, dan kontribusi organisasi."
        actionLabel="Lihat Semua Pengalaman"
        actionTo="/experience"
      />

      {featuredExperiences.length === 0 ? (
        <EmptyState
          icon="ri-briefcase-4-line"
          title="Belum Ada Pengalaman Unggulan"
          description="Tandai pengalaman dengan featured: true pada experiences.json untuk menampilkannya di beranda."
        />
      ) : (
        <div className="space-y-6">
          {featuredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedExperienceSection;
