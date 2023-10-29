{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = with pkgs;
          mkShell {
            name = "Default developpement shell";
            packages = [
              cocogitto
              nixpkgs-fmt
              nodePackages.markdownlint-cli
              pre-commit

              # Ledger
              ledger
              hledger
              hledger-ui
              hledger-web

              # needed by get_prices.ts script
              deno

              # Commands helper
              just
              bkt
            ];
            shellHook = ''
              export PROJ="ledger-tool"
              export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"

              alias run="just"
              echo ""
              echo "⭐ Welcome to the $PROJ project ⭐"
              echo ""
              just
            '';
          };
      });
}
