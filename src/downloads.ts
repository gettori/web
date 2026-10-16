import { SITE } from "./config";
import { RELEASE } from "./packs/view";

// Pinned to the newest release at build time. Every release merges an
// after-<version> branch here, which rebuilds the site and moves these on.
const asset = (name: string) => `${SITE.github}/releases/download/v${RELEASE}/${name}`;

export const DOWNLOADS = {
  version: RELEASE,
  arm: asset(`Tori_${RELEASE}_aarch64.dmg`),
  intel: asset(`Tori_${RELEASE}_x64.dmg`),
  android: asset(`Tori_${RELEASE}.apk`),
  releases: `${SITE.github}/releases`,
};
