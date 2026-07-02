import { resolveTrackIcon, type TrackIconName } from "./track-icons";

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
  icon: TrackIconName;
  initialVolume: number;
  fileName: string;
  hasMissingAudio: boolean;
};

//------------------------------------------------------------------------------
// Track Playlist
//------------------------------------------------------------------------------

export type TrackPlaylist = {
  id: string;
  name: string;
  ambienceTrackIds: string[];
  environmentTrackIds: string[];
  volumes: Record<string, number>;
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
  fileName?: string;
  hasMissingAudio?: boolean;
};

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
    fileName: track.fileName ?? track.name,
    hasMissingAudio: track.hasMissingAudio ?? false,
  };
}

//------------------------------------------------------------------------------
// Get Track Icon
//------------------------------------------------------------------------------

function getTrackIcon(icon: string, fallbackIcon: string) {
  return resolveTrackIcon(icon) ?? resolveTrackIcon(fallbackIcon) ?? "music";
}
