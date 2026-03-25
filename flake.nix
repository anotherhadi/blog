{
  description = "anotherhadi blog";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    bun2nix = {
      url = "github:nix-community/bun2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    bun2nix,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    bun2nixPkg = bun2nix.packages.${system}.default;

    blog = pkgs.stdenv.mkDerivation (finalAttrs: {
      pname = "blog";
      version = "1.0.0";

      src = ./.;

      nativeBuildInputs = [
        pkgs.bun
        bun2nixPkg.hook
      ];

      bunDeps = bun2nixPkg.fetchBunDeps {
        bunNix = ./bun.nix;
      };

      buildPhase = ''
        runHook preBuild
        bun run build
        runHook postBuild
      '';

      installPhase = ''
        runHook preInstall

        mkdir -p $out/share/blog
        cp -r dist/* $out/share/blog/

        runHook postInstall
      '';

      meta = {
        description = "Anotherhadi's blog";
        homepage = "https://github.com/anotherhadi/blog";
        license = pkgs.lib.licenses.mit;
        mainProgram = "blog";
      };
    });
  in {
    packages.${system} = {
      inherit blog;
      default = blog;
    };

    devShells.${system}.default = pkgs.mkShell {
      packages = [
        pkgs.bun
        bun2nixPkg
      ];
    };
  };
}
