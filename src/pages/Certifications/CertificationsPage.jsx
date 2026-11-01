import { useState } from "react";
import { getAllCertifications } from "../../utils/dataHelpers.js";
import CertificationCard from "../../components/certifications/CertificationCard.jsx";
import CertificatePreviewModal from "../../components/certifications/CertificatePreviewModal.jsx";
import EmptyState from "../../components/shared/EmptyState.jsx";

const CertificationsPage = () => {
  const certifications = getAllCertifications();
  const [previewCert, setPreviewCert] = useState(null);

  return (
    <section className="pt-8 pb-16">
      <div className="mb-10">
        <h1 className="sm:text-4xl/snug text-3xl/snug font-bold mb-3">
          Sertifikasi
        </h1>
        <p className="text-base/loose opacity-60 max-w-2xl">
          Daftar lengkap sertifikasi kompetensi dan pelatihan profesional yang telah saya selesaikan.
        </p>
      </div>

      {certifications.length === 0 ? (
        <EmptyState
          icon="ri-award-line"
          title="Belum Ada Sertifikasi"
          description="Data sertifikasi pada certifications.json masih kosong."
        />
      ) : (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {certifications.map((cert) => (
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

export default CertificationsPage;
