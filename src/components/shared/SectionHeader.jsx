import AppLink from "./AppLink.jsx";

/**
 * Header bagian yang konsisten dengan identitas visual proyek.
 */
const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  actionTo,
  centered = false,
}) => {
  if (centered) {
    return (
      <div className="text-center mb-12">
        <h2 className="sm:text-4xl/snug text-3xl/snug font-bold mb-3">{title}</h2>
        {subtitle && (
          <p className="text-base/loose opacity-60 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="sm:text-4xl/snug text-3xl/snug font-bold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-base/loose opacity-60 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <AppLink
          to={actionTo}
          className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-3 rounded-xl text-sm font-medium transition-colors w-fit shrink-0"
        >
          <span>{actionLabel}</span>
          <i className="ri-arrow-right-line ri-lg"></i>
        </AppLink>
      )}
    </div>
  );
};

export default SectionHeader;
