import {
  CloudRainIcon,
  FlameIcon,
  MusicIcon,
  SwordsIcon,
  TreesIcon,
  WindIcon,
  type LucideIcon,
} from "lucide-react";

//------------------------------------------------------------------------------
// Track Kind
//------------------------------------------------------------------------------

export type TrackKind = "ambience" | "environment";

//------------------------------------------------------------------------------
// Track Icon
//------------------------------------------------------------------------------

export type TrackIcon = "music" | "flame" | "swords" | "rain" | "wind" | "trees";

//------------------------------------------------------------------------------
// Track
//------------------------------------------------------------------------------

export type Track = {
  id: string;
  kind: TrackKind;
  name: string;
  src: string;
  icon: LucideIcon;
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

const iconByName: Record<TrackIcon, LucideIcon> = {
  flame: FlameIcon,
  music: MusicIcon,
  rain: CloudRainIcon,
  swords: SwordsIcon,
  trees: TreesIcon,
  wind: WindIcon,
};

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
    icon: iconByName[track.icon ?? fallbackIcon],
    initialVolume: track.initialVolume ?? 50,
  };
}
