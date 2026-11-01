import HeroSection from "../../components/home/HeroSection.jsx";
import AboutSection from "../../components/home/AboutSection.jsx";
import SkillsSection from "../../components/home/SkillsSection.jsx";
import FeaturedProjectsSection from "../../components/home/FeaturedProjectsSection.jsx";
import FeaturedCertificationsSection from "../../components/home/FeaturedCertificationsSection.jsx";
import FeaturedExperienceSection from "../../components/home/FeaturedExperienceSection.jsx";

const HomePage = () => {
  return (
    <div className="space-y-4">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <FeaturedProjectsSection />
      <FeaturedCertificationsSection />
      <FeaturedExperienceSection />
    </div>
  );
};

export default HomePage;
