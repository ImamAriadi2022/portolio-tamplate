import { getProfile } from "../../utils/dataHelpers.js";
import AppLink from "../shared/AppLink.jsx";
import SafeImage from "../shared/SafeImage.jsx";

const HeroSection = () => {
  const profile = getProfile();

  return (
    <section className="hero grid md:grid-cols-2 grid-cols-1 items-center pt-10 xl:gap-0 gap-8">
      <div>
        {profile.quote && (
          <div className="flex items-center gap-3 mb-6 bg-zinc-800 w-fit p-4 rounded-2xl border border-zinc-700/50">
            <SafeImage
              src={profile.avatar}
              alt={profile.name}
              className="w-10 h-10 object-cover rounded-md"
              hideOnEmpty
            />
            <q className="text-sm sm:text-base">{profile.quote}</q>
          </div>
        )}

        <h1 className="sm:text-5xl/tight text-3xl/tight font-bold mb-3">
          Hi, Saya {profile.name}
        </h1>

        {profile.headline && (
          <p className="text-violet-400 font-semibold text-lg mb-4">
            {profile.headline}
          </p>
        )}

        {profile.description && (
          <p className="text-base/loose mb-6 opacity-50">{profile.description}</p>
        )}

        <div className="flex flex-wrap items-center sm:gap-4 gap-3">
          {profile.resume && (
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-violet-700 p-4 rounded-2xl hover:bg-violet-600 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <span>Download CV</span>
              <i className="ri-download-line ri-lg"></i>
            </a>
          )}
          <AppLink
            to="/projects"
            className="bg-zinc-700 p-4 rounded-2xl hover:bg-zinc-600 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <span>Lihat Proyek</span>
            <i className="ri-arrow-right-line ri-lg"></i>
          </AppLink>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <SafeImage
          src={profile.avatar}
          alt={profile.name}
          className="w-full max-w-[500px] md:ml-auto rounded-2xl"
          fallbackClassName="w-full max-w-[500px] h-[420px] rounded-2xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;
