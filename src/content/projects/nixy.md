---
title: "Nixy"
description: "Nixy simplifies and unifies the Hyprland ecosystem with a modular, easily customizable setup. It provides a structured way to manage your system configuration and dotfiles with minimal effort."
image: "../../../public/images/projects/nixy.png"
tags: ["dotfiles", "nixos", "hyprland", "rice"]
demoLink: "https://github.com/anotherhadi/nixy#screenshots"
sourceLink: "https://github.com/anotherhadi/nixy"
---

<a href="https://github.com/anotherhadi/nixy/stargazers">
    <img src="https://img.shields.io/github/stars/anotherhadi/nixy?color=A89AD1&labelColor=0b0b0b&style=for-the-badge&logo=starship&logoColor=A89AD1">
</a>
<a href="https://github.com/anotherhadi/nixy/">
    <img src="https://img.shields.io/github/repo-size/anotherhadi/nixy?color=A89AD1&labelColor=0b0b0b&style=for-the-badge&logo=github&logoColor=A89AD1">
</a>
<a href="https://nixos.org">
    <img src="https://img.shields.io/badge/NixOS-unstable-blue.svg?style=for-the-badge&labelColor=0b0b0b&logo=NixOS&logoColor=A89AD1&color=A89AD1">
</a>
<a href="https://github.com/anotherhadi/nixy/blob/main/LICENSE">
    <img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&colorA=0b0b0b&colorB=A89AD1&logo=unlicense&logoColor=A89AD1"/>
</a>

**Nixy simplifies and unifies** the Hyprland ecosystem with a modular, easily
customizable setup. It provides a structured way to manage your system
configuration and dotfiles with minimal effort. It includes _home-manager_,
_secrets_, and _custom theming_ all in one place.

**Features:**

- 💻 Hyprland & Caelestia: Preconfigured Hyprland ecosystem with Caelestia-shell (Ty to both projects!)
- 🎨 Consistent Theming: Base16 & Stylix-powered themes
- ⌨️ Vim-like Everywhere: Unified keybindings (Hyprland, nvim, vimium, etc.)

## Table of Content

- [Table of Content](#table-of-content)
- [Installation](#installation)
- [Documentation](#documentation)

## Installation

1. [Fork](https://github.com/anotherhadi/nixy/fork) this repo and clone it to
   your system:

```sh
git clone https://github.com/anotherhadi/nixy ~/.config/nixos
```

2. Copy the `hosts/laptop` folder, rename it to match your system’s hostname,
   and update `variables.nix` with your machine’s settings.
3. Copy your `hardware-configuration.nix` into your new host's folder to ensure
   proper hardware support.
4. Register your new host in `flake.nix` by adding it under nixosConfigurations.

> `# CHANGEME` comments are placed throughout the config to
> indicate necessary modifications. Use the following command to quickly locate
> them:
>
> ```sh
> rg "CHANGEME" ~/.config/nixos
> ```

> When you add new files, don't forget to run `git add .` to add them to the git
> repository

5. Build the system

```sh
sudo nixos-rebuild switch --flake ~/.config/nixos#yourhostname
```

## Documentation

- [SERVER](https://github.com/anotherhadi/nixy/blob/main/docs/SERVER.md): Check out the server documentation
- [THEMES](https://github.com/anotherhadi/nixy/blob/main/docs/THEMES.md): How themes work and how to create your own
- [WALLPAPERS](https://github.com/anotherhadi/awesome-wallpapers): An awesome
  collection of wallpapers

- [CONTRIBUTING](https://github.com/anotherhadi/nixy/blob/main/docs/CONTRIBUTING.md): How to contribute
- [LICENSE](https://github.com/anotherhadi/nixy/blob/main/LICENSE): MIT License
