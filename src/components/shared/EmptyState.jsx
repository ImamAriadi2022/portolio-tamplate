/**
 * Komponen tampilan ketika daftar data kosong.
 */
const EmptyState = ({
  icon = "ri-inbox-2-line",
  title = "Belum ada data",
  description = "Data untuk kategori ini belum tersedia.",
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl p-10 text-center my-6">
      <div className="w-14 h-14 rounded-xl bg-zinc-700/60 flex items-center justify-center mx-auto mb-4 text-violet-400">
        <i className={`${icon} ri-2x`}></i>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-60 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default EmptyState;
