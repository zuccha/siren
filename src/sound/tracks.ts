import { dynamicIconImports, type IconName } from "lucide-react/dynamic";

//------------------------------------------------------------------------------
// Track Kind
//------------------------------------------------------------------------------

export type TrackKind = "ambience" | "environment";

//------------------------------------------------------------------------------
// Track Icon
//------------------------------------------------------------------------------

export type TrackIcon = string;

//------------------------------------------------------------------------------
// Track
//------------------------------------------------------------------------------

export type Track = {
  id: string;
  kind: TrackKind;
  name: string;
  src: string;
  icon: IconName;
  initialVolume: number;
};

//------------------------------------------------------------------------------
// Track Manifest
//------------------------------------------------------------------------------

export type TrackManifest = {
  ambience: TrackManifestItem[];
  environment: TrackManifestItem[];
};

//------------------------------------------------------------------------------
// Track Manifest Item
//------------------------------------------------------------------------------

type TrackManifestItem = {
  id: string;
  name: string;
  src: string;
  icon?: TrackIcon;
  initialVolume?: number;
};

const iconImportByName = dynamicIconImports as Record<string, unknown>;

//------------------------------------------------------------------------------
// Load Tracks
//------------------------------------------------------------------------------

export async function loadTracks() {
  const response = await fetch("/sounds/tracks.json");
  if (!response.ok) throw new Error(`Could not load track manifest: ${response.status}`);

  const manifest = (await response.json()) as TrackManifest;
  const ambienceTracks = manifest.ambience.map((track) => createTrack(track, "ambience", "music"));
  const environmentTracks = manifest.environment.map((track) =>
    createTrack(track, "environment", "wind"),
  );

  return {
    ambienceTracks,
    environmentTracks,
    tracks: [...ambienceTracks, ...environmentTracks],
  };
}

//------------------------------------------------------------------------------
// Create Track
//------------------------------------------------------------------------------

function createTrack(track: TrackManifestItem, kind: TrackKind, fallbackIcon: TrackIcon): Track {
  return {
    id: track.id,
    kind,
    name: track.name,
    src: track.src,
    icon: getTrackIcon(track.icon ?? fallbackIcon, fallbackIcon),
    initialVolume: track.initialVolume ?? 50,
  };
}

//------------------------------------------------------------------------------
// Get Track Icon
//------------------------------------------------------------------------------

function getTrackIcon(icon: string, fallbackIcon: string) {
  return resolveTrackIcon(icon) ?? resolveTrackIcon(fallbackIcon) ?? "music";
}

//------------------------------------------------------------------------------
// Resolve Track Icon
//------------------------------------------------------------------------------

function resolveTrackIcon(icon: string) {
  const normalizedIcon = normalizeTrackIconName(icon);
  return findIconName(normalizedIcon);
}

//------------------------------------------------------------------------------
// Normalize Track Icon Name
//------------------------------------------------------------------------------

function normalizeTrackIconName(icon: string) {
  return icon.trim().replace(/Icon$/, "");
}

//------------------------------------------------------------------------------
// Find Icon Name
//------------------------------------------------------------------------------

function findIconName(icon: string): IconName | undefined {
  const candidates = [icon, toKebabCase(icon)];
  return candidates.find(isIconName);
}

//------------------------------------------------------------------------------
// Is Icon Name
//------------------------------------------------------------------------------

function isIconName(icon: string): icon is IconName {
  return icon in iconImportByName;
}

//------------------------------------------------------------------------------
// To Kebab Case
//------------------------------------------------------------------------------

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
