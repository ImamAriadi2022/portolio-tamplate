import { getContact, getNavigation, getProfile } from "../../utils/dataHelpers.js";
import AppLink from "../shared/AppLink.jsx";

const Footer = () => {
  const profile = getProfile();
  const menus = getNavigation();
  const contact = getContact();

  return (
    <footer className="mt-28 py-8 border-t border-zinc-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <AppLink to="/" className="text-2xl font-bold text-white">
            Portofolio
          </AppLink>
          {profile.name && (
            <p className="text-sm opacity-50 mt-1">
              © {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
          )}
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-6">
          {menus.map((menu) => (
            <li key={menu.path}>
              <AppLink
                to={menu.path}
                className="text-sm text-zinc-400 hover:text-violet-400 transition-colors"
              >
                {menu.label}
              </AppLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              aria-label="Email"
              className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-violet-700 flex items-center justify-center transition-colors"
            >
              <i className="ri-mail-line ri-lg"></i>
            </a>
          )}
          {contact.socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-violet-700 flex items-center justify-center transition-colors"
            >
              <i className={`${social.iconClass} ri-lg`}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
