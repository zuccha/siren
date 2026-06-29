import { CloudRainIcon, FlameIcon, MusicIcon, SwordsIcon, TreesIcon, WindIcon } from "lucide-react";

//------------------------------------------------------------------------------
// Track Kind
//------------------------------------------------------------------------------

export type TrackKind = "ambience" | "environment";

//------------------------------------------------------------------------------
// Track
//------------------------------------------------------------------------------

export type Track = {
  id: string;
  kind: TrackKind;
  name: string;
  icon: typeof MusicIcon;
  initialVolume: number;
};

//------------------------------------------------------------------------------
// Ambience Tracks
//------------------------------------------------------------------------------

export const ambienceTracks: Track[] = [
  {
    id: "calm",
    kind: "ambience",
    name: "Calm",
    icon: MusicIcon,
    initialVolume: 52,
  },
  {
    id: "action",
    kind: "ambience",
    name: "Action",
    icon: FlameIcon,
    initialVolume: 48,
  },
  {
    id: "combat",
    kind: "ambience",
    name: "Combat",
    icon: SwordsIcon,
    initialVolume: 46,
  },
];

//------------------------------------------------------------------------------
// Environment Tracks
//------------------------------------------------------------------------------

export const environmentTracks: Track[] = [
  {
    id: "rain",
    kind: "environment",
    name: "Rain",
    icon: CloudRainIcon,
    initialVolume: 38,
  },
  {
    id: "wind",
    kind: "environment",
    name: "Wind",
    icon: WindIcon,
    initialVolume: 32,
  },
  {
    id: "forest",
    kind: "environment",
    name: "Forest",
    icon: TreesIcon,
    initialVolume: 28,
  },
];

//------------------------------------------------------------------------------
// Tracks
//------------------------------------------------------------------------------

export const tracks = [...ambienceTracks, ...environmentTracks];
