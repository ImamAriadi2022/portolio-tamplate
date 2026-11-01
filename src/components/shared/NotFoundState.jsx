import AppLink from "./AppLink.jsx";

/**
 * Komponen tampilan ketika halaman atau item berdasarkan slug tidak ditemukan.
 */
const NotFoundState = ({
  title = "Data Tidak Ditemukan",
  description = "Halaman atau item yang Anda cari tidak tersedia atau telah dipindahkan.",
  backTo = "/",
  backLabel = "Kembali ke Beranda",
}) => {
  return (
    <div className="py-16">
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-10 max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-700 flex items-center justify-center mx-auto mb-6 text-violet-400">
          <i className="ri-error-warning-line ri-2x"></i>
        </div>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-base/loose opacity-60 mb-8">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <AppLink
            to={backTo}
            className="bg-violet-700 hover:bg-violet-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
          >
            <i className="ri-arrow-left-line ri-lg"></i>
            <span>{backLabel}</span>
          </AppLink>
          {backTo !== "/" && (
            <AppLink
              to="/"
              className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
            >
              <i className="ri-home-4-line ri-lg"></i>
              <span>Beranda</span>
            </AppLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundState;
