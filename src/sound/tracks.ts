import { dynamicIconImports, type IconName } from "lucide-react/dynamic";

//------------------------------------------------------------------------------
// Track Kind
//------------------------------------------------------------------------------

export type TrackKind = "ambience" | "environment";

//------------------------------------------------------------------------------
// Track Drop Position
//------------------------------------------------------------------------------

export type TrackDropPosition = "after" | "before";

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
// Track Manifest Item
//------------------------------------------------------------------------------

export type TrackInput = {
  id: string;
  name: string;
  src: string;
  icon?: TrackIcon;
  initialVolume?: number;
};

const iconImportByName = dynamicIconImports as Record<string, unknown>;

//------------------------------------------------------------------------------
// Create Track
//------------------------------------------------------------------------------

export function createTrack(track: TrackInput, kind: TrackKind, fallbackIcon: TrackIcon): Track {
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
