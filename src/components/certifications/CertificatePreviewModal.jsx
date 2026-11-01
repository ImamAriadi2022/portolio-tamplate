import { useEffect } from "react";
import SafeImage from "../shared/SafeImage.jsx";

/**
 * Modal untuk menampilkan pratinjau gambar sertifikat secara penuh.
 */
const CertificatePreviewModal = ({ isOpen, image, title, issuer, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau Sertifikat ${title || ""}`}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-4xl w-full p-4 sm:p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            {issuer && <p className="text-sm opacity-60">{issuer}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup pratinjau"
          >
            <i className="ri-close-line ri-xl"></i>
          </button>
        </div>

        <div className="bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center max-h-[75vh]">
          <SafeImage
            src={image}
            alt={title}
            className="max-h-[72vh] w-auto object-contain"
            fallbackClassName="w-full h-64"
            fallbackText="Gambar sertifikat tidak dapat dimuat"
          />
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;
