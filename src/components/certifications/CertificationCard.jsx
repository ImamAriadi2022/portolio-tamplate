import AppLink from "../shared/AppLink.jsx";
import SafeImage from "../shared/SafeImage.jsx";
import { formatDateIndo } from "../../utils/sorting.js";

/**
 * Kartu sertifikasi reusable untuk halaman Home dan halaman Certifications.
 * Mendukung klik ke halaman detail serta tombol pratinjau gambar sertifikat jika gambar tersedia.
 */
const CertificationCard = ({ certification, onPreviewImage }) => {
  if (!certification) return null;

  const detailUrl = `/certifications/${certification.slug}`;
  const formattedDate = formatDateIndo(certification.issueDate);

  const handlePreviewClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onPreviewImage && certification.image) {
      onPreviewImage(certification);
    }
  };

  return (
    <div className="group bg-zinc-800 p-4 rounded-2xl border border-zinc-700/60 hover:border-violet-500/60 transition-all flex flex-col justify-between">
      <div>
        {certification.image && (
          <div className="relative overflow-hidden rounded-xl bg-zinc-900 aspect-[16/11] mb-4 border border-zinc-700/50">
            <AppLink to={detailUrl} className="block w-full h-full">
              <SafeImage
                src={certification.image}
                alt={certification.name}
                hideOnEmpty
                hideOnError
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </AppLink>
            {onPreviewImage && (
              <button
                type="button"
                onClick={handlePreviewClick}
                title="Pratinjau Sertifikat"
                className="absolute bottom-3 right-3 bg-zinc-900/90 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <i className="ri-zoom-in-line"></i>
                <span>Preview</span>
              </button>
            )}
          </div>
        )}

        <AppLink to={detailUrl} className="block">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
            {certification.issuer && (
              <span className="font-medium text-violet-400 flex items-center gap-1">
                <i className="ri-award-line"></i>
                {certification.issuer}
              </span>
            )}
            {formattedDate && <span>{formattedDate}</span>}
          </div>

          <h3 className="text-lg font-bold group-hover:text-violet-400 transition-colors mb-2">
            {certification.name}
          </h3>

          {certification.description && (
            <p className="text-sm/relaxed opacity-60 mb-4 line-clamp-2">
              {certification.description}
            </p>
          )}

          {certification.skills && certification.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {certification.skills.map((skill, idx) => (
                <span
                  key={`${certification.id}-skill-${idx}`}
                  className="py-1 px-2.5 border border-zinc-600 bg-zinc-700/50 rounded-md text-xs font-medium text-zinc-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </AppLink>
      </div>

      <div className="pt-3 border-t border-zinc-700/60 flex items-center justify-between gap-2">
        <AppLink
          to={detailUrl}
          className="text-sm font-medium text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
        >
          <span>Detail Sertifikasi</span>
          <i className="ri-arrow-right-up-line ri-lg"></i>
        </AppLink>

        {certification.credentialId && (
          <span className="text-xs font-mono text-zinc-400 truncate max-w-[150px]" title={certification.credentialId}>
            {certification.credentialId}
          </span>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;
