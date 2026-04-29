/**
 * Social media links configuration
 */
export interface SocialLinks {
  github?: string;
  gitlab?: string;
  gitea?: string;
  linkedin?: string;
  twitter?: string;
  bluesky?: string;
  instagram?: string;
  youtube?: string;
  codetips?: string;
  kofi?: string;
  medium?: string;
}

/**
 * Main site configuration interface
 */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  avatar: string;
  location: string;
  socialLinks: SocialLinks;
  gpgKey?: string;
  rssFeed?: string;
}

/**
 * Site configuration object
 * Update these values to customize your portfolio
 */
export const siteConfig: SiteConfig = {
  name: "Hadi",
  title: "@anotherhadi - Infosec engineer.",
  description:
    "Infosec engineer passionate about Linux/NixOS, blockchains, OSINT & FOSS. Hacking with Go, exploring open tech, and contributing whenever I can 🐧",
  avatar: "/avatar.png",
  location: "🇫🇷 France",
  socialLinks: {
    github: "https://github.com/anotherhadi",
    gitlab: "https://gitlab.com/anotherhadi_mirror",
    gitea: "https://git.hadi.icu",
    twitter: "",
    bluesky: "",
    kofi: "https://ko-fi.com/anotherhadi",
    medium: "https://medium.com/@anotherhadi",
  },
  gpgKey: "/anotherhadi.asc",
  rssFeed: "https://hadi.icu/rss.xml",
};
