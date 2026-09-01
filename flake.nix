{
  description = "Development environment for personal-recipes";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          nodejs = import ./nix/node-from-prebuilt.nix {
            inherit pkgs system;
            nodeVersion = "24.13.1";
            shasumsHash = "496b662fcf38fca596f8d1dd2e95245ac1597dd49e0c3c60235b0b6f2c072900";
          };
        in
        {
          default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              jujutsu
              nodejs
              corepack_24
              jq
              fzf
            ];

            GREET = "personal-recipes";
          };
        }
      );
    };
}
