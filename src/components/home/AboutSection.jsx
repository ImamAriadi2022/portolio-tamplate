import { getProfile } from "../../utils/dataHelpers.js";
import SafeImage from "../shared/SafeImage.jsx";

const AboutSection = () => {
  const profile = getProfile();

  if (!profile.about) return null;

  return (
    <section className="tentang mt-32 py-10" id="about">
      <div className="xl:w-3/4 lg:w-4/5 w-full mx-auto p-7 sm:p-10 bg-zinc-800 rounded-2xl border border-zinc-700/60">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SafeImage
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-md object-cover sm:hidden block"
              hideOnEmpty
            />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Tentang Saya</h2>
              {profile.location && (
                <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1 mt-1">
                  <i className="ri-map-pin-line text-violet-400"></i>
                  <span>{profile.location}</span>
                </p>
              )}
            </div>
          </div>
          <SafeImage
            src={profile.avatar}
            alt={profile.name}
            className="w-12 h-12 rounded-md object-cover hidden sm:block"
            hideOnEmpty
          />
        </div>

        <p className="text-base/loose mb-10 opacity-75">{profile.about}</p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-zinc-700/70">
          <div className="flex items-center gap-8 sm:gap-12">
            {profile.stats?.projectsCompleted && (
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-1">
                  {profile.stats.projectsCompleted.replace("+", "")}
                  <span className="text-violet-500">+</span>
                </h3>
                <p className="text-sm opacity-60">Proyek Selesai</p>
              </div>
            )}
            {profile.stats?.yearsOfExperience && (
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-1">
                  {profile.stats.yearsOfExperience.replace("+", "")}
                  <span className="text-violet-500">+</span>
                </h3>
                <p className="text-sm opacity-60">Tahun Pengalaman</p>
              </div>
            )}
          </div>

          {profile.headline && (
            <span className="text-xs sm:text-sm font-medium bg-zinc-900/70 border border-zinc-700 px-4 py-2 rounded-xl text-zinc-300">
              {profile.headline}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
