import { useState } from "react";
import { getFeaturedCertifications } from "../../utils/dataHelpers.js";
import CertificationCard from "../certifications/CertificationCard.jsx";
import CertificatePreviewModal from "../certifications/CertificatePreviewModal.jsx";
import SectionHeader from "../shared/SectionHeader.jsx";
import EmptyState from "../shared/EmptyState.jsx";

const FeaturedCertificationsSection = () => {
  const featuredCertifications = getFeaturedCertifications(3);
  const [previewCert, setPreviewCert] = useState(null);

  return (
    <section className="sertifikasi mt-32" id="featured-certifications">
      <SectionHeader
        title="Sertifikasi Unggulan"
        subtitle="Sertifikasi kompetensi profesional di bidang pengembangan web dan desain produk digital."
        actionLabel="Lihat Semua Sertifikasi"
        actionTo="/certifications"
      />

      {featuredCertifications.length === 0 ? (
        <EmptyState
          icon="ri-award-line"
          title="Belum Ada Sertifikasi Unggulan"
          description="Tandai sertifikasi dengan featured: true pada certifications.json untuk menampilkannya di beranda."
        />
      ) : (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {featuredCertifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onPreviewImage={(selected) => setPreviewCert(selected)}
            />
          ))}
        </div>
      )}

      <CertificatePreviewModal
        isOpen={Boolean(previewCert)}
        image={previewCert?.image}
        title={previewCert?.name}
        issuer={previewCert?.issuer}
        onClose={() => setPreviewCert(null)}
      />
    </section>
  );
};

export default FeaturedCertificationsSection;
