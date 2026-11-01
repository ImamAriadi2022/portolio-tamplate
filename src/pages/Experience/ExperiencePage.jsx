import { useState, useMemo } from "react";
import { getAllExperiences } from "../../utils/dataHelpers.js";
import ExperienceCard from "../../components/experience/ExperienceCard.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

const ExperiencePage = () => {
  const experiences = getAllExperiences();
  const [selectedType, setSelectedType] = useState("Semua");

  const experienceTypes = useMemo(() => {
    const types = new Set();
    experiences.forEach((exp) => {
      if (exp.type) {
        types.add(exp.type);
      }
    });
    return ["Semua", ...Array.from(types)];
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    if (selectedType === "Semua") {
      return experiences;
    }
    return experiences.filter((exp) => exp.type === selectedType);
  }, [experiences, selectedType]);

  return (
    <section className="pt-8 pb-16">
      <div className="mb-10">
        <h1 className="sm:text-4xl/snug text-3xl/snug font-bold mb-3">
          Pengalaman
        </h1>
        <p className="text-base/loose opacity-60 max-w-2xl">
          Riwayat pengalaman kerja profesional, proyek freelance, dan kontribusi organisasi yang diurutkan dari periode terbaru.
        </p>
      </div>

      {experienceTypes.length > 2 && (
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {experienceTypes.map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-violet-700 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/60"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      {filteredExperiences.length === 0 ? (
        <EmptyState
          icon="ri-briefcase-4-line"
          title="Belum Ada Pengalaman"
          description="Belum ada data pengalaman yang sesuai untuk ditampilkan."
        />
      ) : (
        <div className="space-y-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ExperiencePage;
