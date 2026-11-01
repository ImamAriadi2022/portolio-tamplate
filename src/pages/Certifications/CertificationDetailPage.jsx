import { useState } from "react";
import { getCertificationBySlug } from "../../utils/dataHelpers.js";
import { formatDateIndo } from "../../utils/sorting.js";
import AppLink from "../../components/shared/AppLink.jsx";
import SafeImage from "../../components/shared/SafeImage.jsx";
import NotFoundState from "../../components/shared/NotFoundState.jsx";
import CertificatePreviewModal from "../../components/certifications/CertificatePreviewModal.jsx";

const CertificationDetailPage = ({ slug }) => {
  const certification = getCertificationBySlug(slug);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!certification) {
    return (
      <NotFoundState
        title="Sertifikasi Tidak Ditemukan"
        description={`Sertifikasi dengan identifier "${slug || ""}" tidak ditemukan.`}
        backTo="/certifications"
        backLabel="Kembali ke Daftar Sertifikasi"
      />
    );
  }

  const formattedDate = formatDateIndo(certification.issueDate);

  return (
    <article className="pt-8 pb-16">
      <div className="mb-8">
        <AppLink
          to="/certifications"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <i className="ri-arrow-left-line ri-lg"></i>
          <span>Kembali ke Daftar Sertifikasi</span>
        </AppLink>
      </div>

      <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {certification.issuer && (
            <span className="bg-violet-700/20 text-violet-300 border border-violet-500/30 text-xs font-semibold px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
              <i className="ri-award-line"></i>
              <span>{certification.issuer}</span>
            </span>
          )}
          {formattedDate && (
            <span className="bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
              <i className="ri-calendar-event-line"></i>
              <span>Diterbitkan: {formattedDate}</span>
            </span>
          )}
          {certification.credentialId && (
            <span className="bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs font-mono px-3 py-1 rounded-lg">
              ID: {certification.credentialId}
            </span>
          )}
        </div>

        <h1 className="sm:text-4xl/tight text-2xl/tight font-bold mb-6">
          {certification.name}
        </h1>

        {certification.image && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 max-w-3xl">
              <SafeImage
                src={certification.image}
                alt={certification.name}
                hideOnEmpty
                hideOnError
                onClick={() => setIsPreviewOpen(true)}
                className="w-full max-h-[460px] object-contain cursor-zoom-in"
              />
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="absolute bottom-4 right-4 bg-zinc-900/90 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl border border-zinc-700 inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <i className="ri-zoom-in-line ri-lg"></i>
                <span>Perbesar Sertifikat</span>
              </button>
            </div>
          </div>
        )}

        {certification.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Deskripsi Sertifikasi</h2>
            <p className="text-base/loose opacity-75">
              {certification.description}
            </p>
          </div>
        )}

        {certification.skills && certification.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">Keahlian Terkait</h2>
            <div className="flex flex-wrap gap-2">
              {certification.skills.map((skill, idx) => (
                <span
                  key={`${certification.id}-detail-skill-${idx}`}
                  className="py-1.5 px-3.5 border border-zinc-600 bg-zinc-700/60 rounded-lg text-sm font-semibold text-zinc-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(certification.credentialUrl || certification.image) && (
          <div className="pt-6 border-t border-zinc-700/70 flex flex-wrap items-center gap-4">
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-violet-700 hover:bg-violet-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
              >
                <span>Verifikasi Kredensial</span>
                <i className="ri-external-link-line ri-lg"></i>
              </a>
            )}
            {certification.image && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <i className="ri-image-line ri-lg"></i>
                <span>Preview Gambar Sertifikat</span>
              </button>
            )}
          </div>
        )}
      </div>

      <CertificatePreviewModal
        isOpen={isPreviewOpen}
        image={certification.image}
        title={certification.name}
        issuer={certification.issuer}
        onClose={() => setIsPreviewOpen(false)}
      />
    </article>
  );
};

export default CertificationDetailPage;
