import { createTrack, type Track, type TrackKind } from "./tracks";

//------------------------------------------------------------------------------
// Local Track Metadata
//------------------------------------------------------------------------------

type LocalTrackMetadata = {
  id: string;
  kind: TrackKind;
  name: string;
  icon: string;
  initialVolume: number;
  fileName: string;
  blobKey: string;
};

//------------------------------------------------------------------------------
// Local Track Input
//------------------------------------------------------------------------------

export type LocalTrackInput = {
  kind: TrackKind;
  name: string;
  icon: string;
  initialVolume: number;
  file: File;
};

//------------------------------------------------------------------------------
// Local Track Update Input
//------------------------------------------------------------------------------

export type LocalTrackUpdateInput = {
  name: string;
  icon: string;
  initialVolume: number;
};

const databaseName = "siren-local-tracks";
const objectStoreName = "audio";
const metadataStorageKey = "siren.localTracks";

//------------------------------------------------------------------------------
// Load Local Tracks
//------------------------------------------------------------------------------

export async function loadLocalTracks() {
  const metadata = loadLocalTrackMetadata();
  const tracks = await Promise.all(metadata.map(loadLocalTrack));

  return tracks.filter((track): track is Track => Boolean(track));
}

//------------------------------------------------------------------------------
// Save Local Track
//------------------------------------------------------------------------------

export async function saveLocalTrack(input: LocalTrackInput) {
  if (!input.file.type.startsWith("audio/")) throw new Error("Local tracks must be audio files.");

  const metadata = createLocalTrackMetadata(input);
  await writeAudioBlob(metadata.blobKey, input.file);
  saveLocalTrackMetadata([...loadLocalTrackMetadata(), metadata]);

  return createTrack(
    {
      id: metadata.id,
      name: metadata.name,
      src: URL.createObjectURL(input.file),
      icon: metadata.icon,
      initialVolume: metadata.initialVolume,
    },
    metadata.kind,
    getFallbackIcon(metadata.kind),
  );
}

//------------------------------------------------------------------------------
// Update Local Track
//------------------------------------------------------------------------------

export function updateLocalTrack(track: Track, input: LocalTrackUpdateInput) {
  const metadata = loadLocalTrackMetadata();
  const nextMetadata = metadata.map((item) =>
    item.id === track.id ? updateLocalTrackMetadata(item, input) : item,
  );
  const updatedMetadata = nextMetadata.find((item) => item.id === track.id);

  saveLocalTrackMetadata(nextMetadata);

  if (!updatedMetadata) return track;

  return createTrack(
    {
      id: updatedMetadata.id,
      name: updatedMetadata.name,
      src: track.src,
      icon: updatedMetadata.icon,
      initialVolume: updatedMetadata.initialVolume,
    },
    updatedMetadata.kind,
    getFallbackIcon(updatedMetadata.kind),
  );
}

//------------------------------------------------------------------------------
// Reorder Local Tracks
//------------------------------------------------------------------------------

export function reorderLocalTracks(kind: TrackKind, trackIds: string[]) {
  const metadata = loadLocalTrackMetadata();
  const metadataById = new Map(metadata.map((item) => [item.id, item]));
  const reorderedMetadata = trackIds
    .map((trackId) => metadataById.get(trackId))
    .filter((item): item is LocalTrackMetadata => item !== undefined && item.kind === kind);

  saveLocalTrackMetadata([...metadata.filter((item) => item.kind !== kind), ...reorderedMetadata]);
}

//------------------------------------------------------------------------------
// Delete Local Track
//------------------------------------------------------------------------------

export async function deleteLocalTrack(trackId: string) {
  const metadata = loadLocalTrackMetadata();
  const track = metadata.find((item) => item.id === trackId);
  if (track) await deleteAudioBlob(track.blobKey);
  saveLocalTrackMetadata(metadata.filter((item) => item.id !== trackId));
}

//------------------------------------------------------------------------------
// Load Local Track
//------------------------------------------------------------------------------

async function loadLocalTrack(metadata: LocalTrackMetadata) {
  const blob = await readAudioBlob(metadata.blobKey);
  if (!blob) return undefined;

  return createTrack(
    {
      id: metadata.id,
      name: metadata.name,
      src: URL.createObjectURL(blob),
      icon: metadata.icon,
      initialVolume: metadata.initialVolume,
    },
    metadata.kind,
    getFallbackIcon(metadata.kind),
  );
}

//------------------------------------------------------------------------------
// Create Local Track Metadata
//------------------------------------------------------------------------------

function createLocalTrackMetadata(input: LocalTrackInput): LocalTrackMetadata {
  const id = `local-${input.kind}-${crypto.randomUUID()}`;

  return {
    id,
    kind: input.kind,
    name: input.name.trim() || removeFileExtension(input.file.name),
    icon: input.icon.trim() || getFallbackIcon(input.kind),
    initialVolume: input.initialVolume,
    fileName: input.file.name,
    blobKey: id,
  };
}

//------------------------------------------------------------------------------
// Update Local Track Metadata
//------------------------------------------------------------------------------

function updateLocalTrackMetadata(
  metadata: LocalTrackMetadata,
  input: LocalTrackUpdateInput,
): LocalTrackMetadata {
  return {
    ...metadata,
    name: input.name.trim() || metadata.name,
    icon: input.icon.trim() || getFallbackIcon(metadata.kind),
    initialVolume: input.initialVolume,
  };
}

//------------------------------------------------------------------------------
// Load Local Track Metadata
//------------------------------------------------------------------------------

function loadLocalTrackMetadata() {
  const serializedMetadata = localStorage.getItem(metadataStorageKey);
  if (!serializedMetadata) return [];

  try {
    return JSON.parse(serializedMetadata) as LocalTrackMetadata[];
  } catch {
    return [];
  }
}

//------------------------------------------------------------------------------
// Save Local Track Metadata
//------------------------------------------------------------------------------

function saveLocalTrackMetadata(metadata: LocalTrackMetadata[]) {
  localStorage.setItem(metadataStorageKey, JSON.stringify(metadata));
}

//------------------------------------------------------------------------------
// Open Database
//------------------------------------------------------------------------------

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(objectStoreName);
    };
  });
}

//------------------------------------------------------------------------------
// Read Audio Blob
//------------------------------------------------------------------------------

async function readAudioBlob(key: string) {
  const database = await openDatabase();

  return new Promise<Blob | undefined>((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, "readonly");
    const request = transaction.objectStore(objectStoreName).get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    transaction.oncomplete = () => database.close();
  });
}

//------------------------------------------------------------------------------
// Write Audio Blob
//------------------------------------------------------------------------------

async function writeAudioBlob(key: string, blob: Blob) {
  const database = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, "readwrite");
    const request = transaction.objectStore(objectStoreName).put(blob, key);

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
  });
}

//------------------------------------------------------------------------------
// Delete Audio Blob
//------------------------------------------------------------------------------

async function deleteAudioBlob(key: string) {
  const database = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, "readwrite");
    const request = transaction.objectStore(objectStoreName).delete(key);

    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
  });
}

//------------------------------------------------------------------------------
// Get Fallback Icon
//------------------------------------------------------------------------------

function getFallbackIcon(kind: TrackKind) {
  return kind === "ambience" ? "music" : "wind";
}

//------------------------------------------------------------------------------
// Remove File Extension
//------------------------------------------------------------------------------

function removeFileExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}
