# Builds a Node.js derivation from a prebuilt binary for a specific version.
# Usage: mkNodeFromPrebuilt { inherit pkgs system; nodeVersion = "24.11.0"; shasumsHash = "..."; }
{
  pkgs,
  system,
  nodeVersion,
  shasumsHash,
}:
let
  nixSystemStringsToNodeArchitectureStrings =
    input:
    builtins.replaceStrings
      [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ]
      [ "linux-x64" "linux-arm64" "darwin-arm64" ]
      input;

  nodeArchitectureStringsToNixSystemStrings =
    input:
    builtins.replaceStrings
      [ "linux-x64" "linux-arm64" "darwin-arm64" ]
      [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ]
      input;

  stringHasSuffix = suffix: s: (builtins.match ".*${pkgs.lib.strings.escapeRegex suffix}$" s) != null;
  stringContains =
    needle: haystack: (builtins.match ".*${pkgs.lib.strings.escapeRegex needle}.*" haystack) != null;

  relevantNodeHash =
    let
      hashList = builtins.readFile (
        pkgs.fetchurl {
          url = "https://nodejs.org/download/release/v${nodeVersion}/SHASUMS256.txt";
          sha256 = builtins.convertHash {
            hashAlgo = "sha256";
            hash = shasumsHash;
            toHashFormat = "sri";
          };
        }
      );
      lines = pkgs.lib.strings.splitString "\n" hashList;
      gzipsOnly = builtins.filter (stringHasSuffix ".tar.gz") lines;
      withNixSystemStrings = builtins.map nodeArchitectureStringsToNixSystemStrings gzipsOnly;
      relevantArchitecture = builtins.elemAt (builtins.filter (stringContains system) withNixSystemStrings) 0;
      relevantHash = builtins.elemAt (builtins.split "  " relevantArchitecture) 0;
    in
    relevantHash;
in
pkgs.stdenv.mkDerivation {
  pname = "nodejs";
  version = nodeVersion;

  src = pkgs.fetchurl {
    url = "https://nodejs.org/dist/v${nodeVersion}/node-v${nodeVersion}-${nixSystemStringsToNodeArchitectureStrings system}.tar.gz";
    sha256 = builtins.convertHash {
      hashAlgo = "sha256";
      hash = relevantNodeHash;
      toHashFormat = "sri";
    };
  };

  nativeBuildInputs = pkgs.lib.optionals pkgs.stdenv.hostPlatform.isLinux [
    pkgs.autoPatchelfHook
  ];

  buildInputs = pkgs.lib.optionals pkgs.stdenv.hostPlatform.isLinux [
    pkgs.stdenv.cc.cc.lib
    pkgs.glibc
  ];

  installPhase = ''
    echo "Installing Node.js version ${nodeVersion} from prebuilt binary for system ${system}" >> log.txt

    mkdir -p $out/bin $out/include $out/lib
    tar -xzf $src --strip-components=1 -C $out
    ln -s $out/bin/node $out/bin/nodejs
  '';

  meta = with pkgs.lib; {
    description = "Prebuilt Node.js binary version ${nodeVersion}";
    platforms = [
      "x86_64-linux"
      "aarch64-linux"
      "aarch64-darwin"
    ];
    homepage = "https://nodejs.org/";
  };
}
