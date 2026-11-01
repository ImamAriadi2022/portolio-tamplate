import { getProfile, getFlatSkills, getAllProjects } from "./utils/dataHelpers.js";

const profile = getProfile();

const Image = {
  HeroImage: profile.avatar,
};

export default Image;

export const listTools = getFlatSkills().map((skill, index) => ({
  id: index + 1,
  gambar: skill.iconData?.src || skill.icon,
  nama: skill.name,
  ket: skill.role,
  dad: String((index + 1) * 100),
}));

export const listProyek = getAllProjects().map((proj, index) => ({
  id: index + 1,
  gambar: proj.thumbnail,
  nama: proj.title,
  desk: proj.shortDescription,
  tools: proj.technologies,
  dad: String((index + 2) * 100),
}));
