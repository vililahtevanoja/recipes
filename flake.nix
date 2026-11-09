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
            nodeVersion = "26.13.0";
            shasumsHash = "9b0d4aa4d20a4f1afaf2cdcf99175ad90d1856d24c7d31dc46f72369b73e2d35";
          };
        in
        {
          default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              jujutsu
              nodejs
              corepack
              jq
              fzf
            ];

            GREET = "personal-recipes";
          };
        }
      );
    };
}
