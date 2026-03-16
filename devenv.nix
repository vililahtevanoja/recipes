{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:
let
  nodejs = import ./nix/node-from-prebuilt.nix {
    inherit pkgs;
    system = pkgs.stdenv.hostPlatform.system;
    nodeVersion = "24.13.1";
    shasumsHash = "496b662fcf38fca596f8d1dd2e95245ac1597dd49e0c3c60235b0b6f2c072900";
  };
in
{
  # https://devenv.sh/basics/
  env.GREET = "personal-recipes";

  # https://devenv.sh/packages/
  packages = with pkgs; [
    jujutsu
    nodejs
    corepack_24
    jq
    fzf
  ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/basics/
  enterShell = ''
    export PATH="$PATH:${pkgs.corepack_24}/bin"
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };
  tasks = {
    "recipes:verify".exec = "pnpm verify";
  };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    jujutsu --version
    node --version
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
