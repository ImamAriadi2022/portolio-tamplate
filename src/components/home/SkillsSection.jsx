import { getSkills } from "../../utils/dataHelpers.js";
import SafeImage from "../shared/SafeImage.jsx";
import SectionHeader from "../shared/SectionHeader.jsx";
import EmptyState from "../shared/EmptyState.jsx";

const SkillsSection = () => {
  const categories = getSkills();

  return (
    <section className="tools mt-32" id="skills">
      <SectionHeader
        title="Tools yang dipakai"
        subtitle="Berikut ini beberapa tools yang biasa saya pakai untuk pembuatan Website ataupun Design."
      />

      {categories.length === 0 ? (
        <EmptyState
          icon="ri-tools-line"
          title="Data Keahlian Kosong"
          description="Belum ada data keahlian yang terdaftar pada skills.json."
        />
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                <span>{category.name}</span>
              </h3>
              <div className="tools-box grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {category.items.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-3 p-3 border border-zinc-600 rounded-md hover:bg-zinc-800 group transition-colors"
                  >
                    {tool.iconData?.type === "image" ? (
                      <SafeImage
                        src={tool.iconData.src}
                        alt={tool.name}
                        className="w-14 h-14 object-contain bg-zinc-800 p-1.5 group-hover:bg-zinc-900 rounded transition-colors shrink-0"
                        fallbackClassName="w-14 h-14 rounded shrink-0"
                        fallbackIcon="ri-code-s-slash-line"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-zinc-800 group-hover:bg-zinc-900 rounded flex items-center justify-center shrink-0 transition-colors">
                        <i
                          className={`${
                            tool.iconData?.className || "ri-code-s-slash-line text-violet-400"
                          } ri-2x`}
                        ></i>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold truncate">{tool.name}</h4>
                      {tool.role && (
                        <p className="opacity-50 text-sm truncate">{tool.role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
