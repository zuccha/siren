import { importLocalPreset, type LocalPresetInput } from "./local-tracks";

import type { TrackKind } from "./tracks";

//------------------------------------------------------------------------------
// Preset Import Progress
//------------------------------------------------------------------------------

export type PresetImportProgress = {
  current: number;
  total: number;
};

type PresetManifest = {
  name: string;
  playlists: PresetPlaylist[];
  tracks: PresetTrack[];
};

type PresetTrack = {
  id: string;
  name: string;
  type: TrackKind;
  icon: string;
  defaultVolume: number;
  file: string;
};

type PresetPlaylist = {
  name: string;
  ambience: PresetPlaylistTrack[];
  environment: PresetPlaylistTrack[];
};

type PresetPlaylistTrack = {
  id: string;
  volume: number;
};

const presetBasePath = `${import.meta.env.BASE_URL}presets/`;

//------------------------------------------------------------------------------
// Import Starter Preset
//------------------------------------------------------------------------------

export async function importStarterPreset(onProgress?: (progress: PresetImportProgress) => void) {
  const manifest = await loadPresetManifest();
  const preset = await createLocalPresetInput(manifest, onProgress);

  return importLocalPreset(preset);
}

//------------------------------------------------------------------------------
// Load Preset Manifest
//------------------------------------------------------------------------------

async function loadPresetManifest() {
  const response = await fetch(`${presetBasePath}index.json`);
  if (!response.ok) throw new Error("Could not load preset metadata.");

  return parsePresetManifest(await response.json());
}

//------------------------------------------------------------------------------
// Create Local Preset Input
//------------------------------------------------------------------------------

async function createLocalPresetInput(
  manifest: PresetManifest,
  onProgress?: (progress: PresetImportProgress) => void,
): Promise<LocalPresetInput> {
  const tracks = [];

  for (const [index, track] of manifest.tracks.entries()) {
    onProgress?.({ current: index, total: manifest.tracks.length });
    tracks.push({
      id: track.id,
      kind: track.type,
      name: track.name,
      icon: track.icon,
      initialVolume: track.defaultVolume,
      fileName: getPresetFileName(track.file),
      file: await loadPresetTrackFile(track.file),
    });
    onProgress?.({ current: index + 1, total: manifest.tracks.length });
  }

  return {
    playlists: manifest.playlists,
    tracks,
  };
}

//------------------------------------------------------------------------------
// Load Preset Track File
//------------------------------------------------------------------------------

async function loadPresetTrackFile(filePath: string) {
  const response = await fetch(`${presetBasePath}${encodeURI(filePath)}`);
  if (!response.ok) throw new Error(`Could not load preset audio file: ${filePath}.`);

  const blob = await response.blob();
  const type = blob.type || getAudioMimeType(filePath);

  return new File([blob], getPresetFileName(filePath), { type });
}

//------------------------------------------------------------------------------
// Get Preset File Name
//------------------------------------------------------------------------------

function getPresetFileName(filePath: string) {
  return filePath.split("/").at(-1) ?? filePath;
}

//------------------------------------------------------------------------------
// Get Audio Mime Type
//------------------------------------------------------------------------------

function getAudioMimeType(filePath: string) {
  if (filePath.endsWith(".mp3")) return "audio/mpeg";
  if (filePath.endsWith(".wav")) return "audio/wav";
  if (filePath.endsWith(".ogg")) return "audio/ogg";
  if (filePath.endsWith(".m4a")) return "audio/mp4";

  return "audio/mpeg";
}

//------------------------------------------------------------------------------
// Parse Preset Manifest
//------------------------------------------------------------------------------

function parsePresetManifest(value: unknown): PresetManifest {
  if (!isRecord(value)) throw new Error("Preset metadata is invalid.");

  const manifest = {
    name: parseString(value["name"]),
    playlists: parseArray(value["playlists"], parsePresetPlaylist),
    tracks: parseArray(value["tracks"], parsePresetTrack),
  };

  validateUniqueIds(
    manifest.tracks.map((track) => track.id),
    "This preset contains duplicate track IDs.",
  );
  validatePresetTrackReferences(manifest);

  return manifest;
}

//------------------------------------------------------------------------------
// Parse Preset Track
//------------------------------------------------------------------------------

function parsePresetTrack(value: unknown): PresetTrack {
  if (!isRecord(value)) throw new Error("Preset track metadata is invalid.");

  return {
    id: parseString(value["id"]),
    name: parseString(value["name"]),
    type: parseTrackKind(value["type"]),
    icon: parseString(value["icon"]),
    defaultVolume: parseVolume(value["defaultVolume"]),
    file: parseString(value["file"]),
  };
}

//------------------------------------------------------------------------------
// Parse Preset Playlist
//------------------------------------------------------------------------------

function parsePresetPlaylist(value: unknown): PresetPlaylist {
  if (!isRecord(value)) throw new Error("Preset playlist metadata is invalid.");

  return {
    name: parseString(value["name"]),
    ambience: parseArray(value["ambience"], parsePresetPlaylistTrack),
    environment: parseArray(value["environment"], parsePresetPlaylistTrack),
  };
}

//------------------------------------------------------------------------------
// Parse Preset Playlist Track
//------------------------------------------------------------------------------

function parsePresetPlaylistTrack(value: unknown): PresetPlaylistTrack {
  if (!isRecord(value)) throw new Error("Preset playlist track metadata is invalid.");

  return {
    id: parseString(value["id"]),
    volume: parseVolume(value["volume"]),
  };
}

//------------------------------------------------------------------------------
// Parse Array
//------------------------------------------------------------------------------

function parseArray<T>(value: unknown, parseItem: (item: unknown) => T) {
  if (!Array.isArray(value)) throw new Error("Preset metadata is invalid.");

  return value.map(parseItem);
}

//------------------------------------------------------------------------------
// Parse String
//------------------------------------------------------------------------------

function parseString(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Preset metadata is invalid.");
  }

  return value;
}

//------------------------------------------------------------------------------
// Parse Track Kind
//------------------------------------------------------------------------------

function parseTrackKind(value: unknown): TrackKind {
  if (value === "ambience" || value === "environment") return value;

  throw new Error("Preset track type is invalid.");
}

//------------------------------------------------------------------------------
// Parse Volume
//------------------------------------------------------------------------------

function parseVolume(value: unknown) {
  if (typeof value !== "number" || value < 0 || value > 100) {
    throw new Error("Preset volume is invalid.");
  }

  return value;
}

//------------------------------------------------------------------------------
// Validate Preset Track References
//------------------------------------------------------------------------------

function validatePresetTrackReferences(manifest: PresetManifest) {
  const trackById = new Map(manifest.tracks.map((track) => [track.id, track]));

  for (const playlist of manifest.playlists) {
    validatePresetTrackReferenceKind(playlist.ambience, trackById, "ambience");
    validatePresetTrackReferenceKind(playlist.environment, trackById, "environment");
  }
}

//------------------------------------------------------------------------------
// Validate Unique Ids
//------------------------------------------------------------------------------

function validateUniqueIds(ids: string[], message: string) {
  if (new Set(ids).size !== ids.length) throw new Error(message);
}

//------------------------------------------------------------------------------
// Validate Preset Track Reference Kind
//------------------------------------------------------------------------------

function validatePresetTrackReferenceKind(
  playlistTracks: PresetPlaylistTrack[],
  trackById: Map<string, PresetTrack>,
  kind: TrackKind,
) {
  for (const playlistTrack of playlistTracks) {
    const track = trackById.get(playlistTrack.id);
    if (!track) throw new Error(`This preset references a missing track: ${playlistTrack.id}.`);
    if (track.type !== kind) throw new Error("This preset has a track in the wrong section.");
  }
}

//------------------------------------------------------------------------------
// Is Record
//------------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
