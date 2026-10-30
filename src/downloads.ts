import { SITE } from "./config";
import { ANDROID_RELEASE, RELEASE, RELEASE_TAG } from "./packs/view";

// Pinned to each platform's newest release at build time. Every release merges
// an after-<version> branch here, which rebuilds the site and moves these on.
const asset = (tag: string, name: string) => `${SITE.github}/releases/download/${tag}/${name}`;

export const DOWNLOADS = {
  version: RELEASE,
  arm: asset(RELEASE_TAG, `Tori_${RELEASE}_aarch64.dmg`),
  intel: asset(RELEASE_TAG, `Tori_${RELEASE}_x64.dmg`),
  android: asset(ANDROID_RELEASE.tag, `Tori_${ANDROID_RELEASE.version}.apk`),
  releases: `${SITE.github}/releases`,
};
