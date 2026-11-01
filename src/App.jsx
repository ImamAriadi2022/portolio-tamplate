import { useEffect } from "react";
import { useRouter } from "./hooks/useRouter.js";
import {
  getProfile,
  getProjectBySlug,
  getCertificationBySlug,
  getExperienceBySlug,
} from "./utils/dataHelpers.js";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import ProjectsPage from "./pages/Projects/ProjectsPage.jsx";
import ProjectDetailPage from "./pages/Projects/ProjectDetailPage.jsx";
import CertificationsPage from "./pages/Certifications/CertificationsPage.jsx";
import CertificationDetailPage from "./pages/Certifications/CertificationDetailPage.jsx";
import ExperiencePage from "./pages/Experience/ExperiencePage.jsx";
import ExperienceDetailPage from "./pages/Experience/ExperienceDetailPage.jsx";
import ContactPage from "./pages/Contact/ContactPage.jsx";
import NotFoundState from "./components/shared/NotFoundState.jsx";

function App() {
  const { page, params } = useRouter();
  const profile = getProfile();

  useEffect(() => {
    const baseTitle = profile.name || "Portofolio";
    if (page === "home") {
      document.title = baseTitle;
    } else if (page === "projects") {
      document.title = `Projects — ${baseTitle}`;
    } else if (page === "project-detail") {
      const proj = getProjectBySlug(params.slug);
      document.title = proj ? `${proj.title} — ${baseTitle}` : `Project — ${baseTitle}`;
    } else if (page === "certifications") {
      document.title = `Certifications — ${baseTitle}`;
    } else if (page === "certification-detail") {
      const cert = getCertificationBySlug(params.slug);
      document.title = cert ? `${cert.name} — ${baseTitle}` : `Certification — ${baseTitle}`;
    } else if (page === "experience") {
      document.title = `Experience — ${baseTitle}`;
    } else if (page === "experience-detail") {
      const exp = getExperienceBySlug(params.slug);
      document.title = exp
        ? `${exp.position} @ ${exp.organization} — ${baseTitle}`
        : `Experience — ${baseTitle}`;
    } else if (page === "contact") {
      document.title = `Contact — ${baseTitle}`;
    } else {
      document.title = `Halaman Tidak Ditemukan — ${baseTitle}`;
    }
  }, [page, params.slug, profile.name]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "projects":
        return <ProjectsPage />;
      case "project-detail":
        return <ProjectDetailPage slug={params.slug} />;
      case "certifications":
        return <CertificationsPage />;
      case "certification-detail":
        return <CertificationDetailPage slug={params.slug} />;
      case "experience":
        return <ExperiencePage />;
      case "experience-detail":
        return <ExperienceDetailPage slug={params.slug} />;
      case "contact":
        return <ContactPage />;
      default:
        return (
          <NotFoundState
            title="Halaman Tidak Ditemukan (404)"
            description="URL yang Anda akses tidak tersedia. Silakan kembali ke halaman utama."
            backTo="/"
            backLabel="Kembali ke Beranda"
          />
        );
    }
  };

  return <MainLayout>{renderPage()}</MainLayout>;
}

export default App;
