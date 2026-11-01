import { navigateTo } from "../../hooks/useRouter.js";

/**
 * Komponen tautan internal yang mendukung SPA navigation sekaligus mempertahankan perilaku asli tag <a>
 * (seperti klik kanan buka tab baru, Ctrl+Click, dan aksesibilitas).
 */
const AppLink = ({ to = "/", children, className = "", onClick, ...rest }) => {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      rest.target === "_blank"
    ) {
      return;
    }
    event.preventDefault();
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};

export default AppLink;
