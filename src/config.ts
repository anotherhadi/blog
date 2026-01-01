/**
 * Social media links configuration
 */
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  bluesky?: string;
  instagram?: string;
  youTube?: string;
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
}

/**
 * Site configuration object
 * Update these values to customize your portfolio
 */
export const siteConfig: SiteConfig = {
  name: "Hadi",
  title: "Infosec engineer.",
  description:
    "Infosec engineer passionate about Linux/NixOS, blockchains, OSINT & FOSS. Hacking with Go, exploring open tech, and contributing whenever I can 🐧",
  avatar: "/avatar.png",
  location: "🇫🇷 France",
  socialLinks: {
    github: "https://github.com/anotherhadi",
    twitter: "https://x.com/anotherhadi",
    bluesky: "https://bsky.app/profile/hadi1842.bsky.social",
    kofi: "https://ko-fi.com/anotherhadi",
    medium: "https://medium.com/anotherhadi",
  },
  gpgKey: "/anotherhadi.asc",
};
