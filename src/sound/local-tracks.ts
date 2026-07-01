import { createTrack, type Track, type TrackKind, type TrackPlaylist } from "./tracks";

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
// Local Library Metadata
//------------------------------------------------------------------------------

type LocalLibraryMetadata = {
  playlists: TrackPlaylist[];
  tracks: LocalTrackMetadata[];
};

//------------------------------------------------------------------------------
// Local Track Library
//------------------------------------------------------------------------------

export type LocalTrackLibrary = {
  playlists: TrackPlaylist[];
  tracks: Track[];
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
  file?: File;
};

const databaseName = "siren-local-tracks";
const objectStoreName = "audio";
const libraryStorageKey = "siren.library";

//------------------------------------------------------------------------------
// Load Local Track Library
//------------------------------------------------------------------------------

export async function loadLocalTrackLibrary(): Promise<LocalTrackLibrary> {
  const metadata = loadLocalLibraryMetadata();
  const tracks = await Promise.all(metadata.tracks.map(loadLocalTrack));

  return {
    playlists: metadata.playlists,
    tracks,
  };
}

//------------------------------------------------------------------------------
// Save Local Track
//------------------------------------------------------------------------------

export async function saveLocalTrack(input: LocalTrackInput) {
  if (!input.file.type.startsWith("audio/")) throw new Error("Local tracks must be audio files.");

  const metadata = createLocalTrackMetadata(input);
  const libraryMetadata = loadLocalLibraryMetadata();

  await writeAudioBlob(metadata.blobKey, input.file);
  saveLocalLibraryMetadata({
    ...libraryMetadata,
    tracks: [...libraryMetadata.tracks, metadata],
  });

  return createLocalTrackFromMetadata(metadata, URL.createObjectURL(input.file));
}

//------------------------------------------------------------------------------
// Update Local Track
//------------------------------------------------------------------------------

export async function updateLocalTrack(track: Track, input: LocalTrackUpdateInput) {
  if (input.file && !input.file.type.startsWith("audio/")) {
    throw new Error("Local tracks must be audio files.");
  }

  const libraryMetadata = loadLocalLibraryMetadata();
  const tracks = libraryMetadata.tracks.map((item) =>
    item.id === track.id ? updateLocalTrackMetadata(item, input) : item,
  );
  const updatedMetadata = tracks.find((item) => item.id === track.id);

  saveLocalLibraryMetadata({ ...libraryMetadata, tracks });

  if (!updatedMetadata) return track;
  if (input.file) await writeAudioBlob(updatedMetadata.blobKey, input.file);

  return createLocalTrackFromMetadata(
    updatedMetadata,
    input.file ? URL.createObjectURL(input.file) : track.src,
    !input.file && track.hasMissingAudio,
  );
}

//------------------------------------------------------------------------------
// Delete Local Track
//------------------------------------------------------------------------------

export async function deleteLocalTrack(trackId: string) {
  const libraryMetadata = loadLocalLibraryMetadata();
  const track = libraryMetadata.tracks.find((item) => item.id === trackId);
  if (track) await deleteAudioBlob(track.blobKey);

  saveLocalLibraryMetadata({
    playlists: libraryMetadata.playlists.map((playlist) =>
      removeTrackFromPlaylist(playlist, trackId),
    ),
    tracks: libraryMetadata.tracks.filter((item) => item.id !== trackId),
  });
}

//------------------------------------------------------------------------------
// Save Local Playlist
//------------------------------------------------------------------------------

export function saveLocalPlaylist(name: string) {
  const libraryMetadata = loadLocalLibraryMetadata();
  const playlist = createPlaylist(name);

  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: [...libraryMetadata.playlists, playlist],
  });

  return playlist;
}

//------------------------------------------------------------------------------
// Update Local Playlist
//------------------------------------------------------------------------------

export function updateLocalPlaylist(playlistId: string, name: string) {
  const libraryMetadata = loadLocalLibraryMetadata();
  const playlists = libraryMetadata.playlists.map((playlist) =>
    playlist.id === playlistId ? { ...playlist, name: name.trim() || playlist.name } : playlist,
  );

  saveLocalLibraryMetadata({ ...libraryMetadata, playlists });

  return playlists.find((playlist) => playlist.id === playlistId);
}

//------------------------------------------------------------------------------
// Delete Local Playlist
//------------------------------------------------------------------------------

export function deleteLocalPlaylist(playlistId: string) {
  const libraryMetadata = loadLocalLibraryMetadata();
  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: libraryMetadata.playlists.filter((playlist) => playlist.id !== playlistId),
  });
}

//------------------------------------------------------------------------------
// Add Local Playlist Track
//------------------------------------------------------------------------------

export function addLocalPlaylistTrack(playlistId: string, track: Track) {
  const libraryMetadata = loadLocalLibraryMetadata();

  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: libraryMetadata.playlists.map((playlist) =>
      playlist.id === playlistId ? addTrackToPlaylist(playlist, track) : playlist,
    ),
  });
}

//------------------------------------------------------------------------------
// Remove Local Playlist Track
//------------------------------------------------------------------------------

export function removeLocalPlaylistTrack(playlistId: string, trackId: string) {
  const libraryMetadata = loadLocalLibraryMetadata();

  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: libraryMetadata.playlists.map((playlist) =>
      playlist.id === playlistId ? removeTrackFromPlaylist(playlist, trackId) : playlist,
    ),
  });
}

//------------------------------------------------------------------------------
// Update Local Playlist Track Volume
//------------------------------------------------------------------------------

export function updateLocalPlaylistTrackVolume(
  playlistId: string,
  trackId: string,
  volume: number,
) {
  const libraryMetadata = loadLocalLibraryMetadata();

  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: libraryMetadata.playlists.map((playlist) => {
      if (playlist.id !== playlistId) return playlist;

      return {
        ...playlist,
        volumes: {
          ...getPlaylistVolumes(playlist),
          [trackId]: volume,
        },
      };
    }),
  });
}

//------------------------------------------------------------------------------
// Reorder Local Playlist Tracks
//------------------------------------------------------------------------------

export function reorderLocalPlaylistTracks(
  playlistId: string,
  kind: TrackKind,
  trackIds: string[],
) {
  const libraryMetadata = loadLocalLibraryMetadata();

  saveLocalLibraryMetadata({
    ...libraryMetadata,
    playlists: libraryMetadata.playlists.map((playlist) => {
      if (playlist.id !== playlistId) return playlist;

      return {
        ...playlist,
        [getPlaylistTrackIdsKey(kind)]: trackIds,
      };
    }),
  });
}

//------------------------------------------------------------------------------
// Load Local Track
//------------------------------------------------------------------------------

async function loadLocalTrack(metadata: LocalTrackMetadata) {
  const blob = await readAudioBlob(metadata.blobKey);
  if (!blob) return createLocalTrackFromMetadata(metadata, "", true);

  return createLocalTrackFromMetadata(metadata, URL.createObjectURL(blob));
}

//------------------------------------------------------------------------------
// Create Local Track From Metadata
//------------------------------------------------------------------------------

function createLocalTrackFromMetadata(
  metadata: LocalTrackMetadata,
  src: string,
  hasMissingAudio = false,
) {
  return createTrack(
    {
      id: metadata.id,
      name: metadata.name,
      src,
      icon: metadata.icon,
      initialVolume: metadata.initialVolume,
      fileName: metadata.fileName,
      hasMissingAudio,
    },
    metadata.kind,
    getFallbackIcon(metadata.kind),
  );
}

//------------------------------------------------------------------------------
// Create Local Track Metadata
//------------------------------------------------------------------------------

function createLocalTrackMetadata(input: LocalTrackInput): LocalTrackMetadata {
  const id = `track-${crypto.randomUUID()}`;

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
    fileName: input.file?.name ?? metadata.fileName,
  };
}

//------------------------------------------------------------------------------
// Create Playlist
//------------------------------------------------------------------------------

function createPlaylist(name: string): TrackPlaylist {
  return {
    id: `playlist-${crypto.randomUUID()}`,
    name: name.trim() || "Untitled playlist",
    ambienceTrackIds: [],
    environmentTrackIds: [],
    volumes: {},
  };
}

//------------------------------------------------------------------------------
// Create Empty Library Metadata
//------------------------------------------------------------------------------

function createEmptyLibraryMetadata(): LocalLibraryMetadata {
  return {
    playlists: [],
    tracks: [],
  };
}

//------------------------------------------------------------------------------
// Add Track To Playlist
//------------------------------------------------------------------------------

function addTrackToPlaylist(playlist: TrackPlaylist, track: Track) {
  const key = getPlaylistTrackIdsKey(track.kind);
  if (playlist[key].includes(track.id)) return playlist;

  return {
    ...playlist,
    [key]: [...playlist[key], track.id],
    volumes: {
      ...getPlaylistVolumes(playlist),
      [track.id]: track.initialVolume,
    },
  };
}

//------------------------------------------------------------------------------
// Remove Track From Playlist
//------------------------------------------------------------------------------

function removeTrackFromPlaylist(playlist: TrackPlaylist, trackId: string): TrackPlaylist {
  const { [trackId]: _removedVolume, ...volumes } = getPlaylistVolumes(playlist);

  return {
    ...playlist,
    ambienceTrackIds: playlist.ambienceTrackIds.filter((id) => id !== trackId),
    environmentTrackIds: playlist.environmentTrackIds.filter((id) => id !== trackId),
    volumes,
  };
}

//------------------------------------------------------------------------------
// Get Playlist Volumes
//------------------------------------------------------------------------------

function getPlaylistVolumes(playlist: TrackPlaylist) {
  return playlist.volumes ?? {};
}

//------------------------------------------------------------------------------
// Get Playlist Track Ids Key
//------------------------------------------------------------------------------

function getPlaylistTrackIdsKey(kind: TrackKind) {
  return kind === "ambience" ? "ambienceTrackIds" : "environmentTrackIds";
}

//------------------------------------------------------------------------------
// Load Local Library Metadata
//------------------------------------------------------------------------------

function loadLocalLibraryMetadata(): LocalLibraryMetadata {
  const serializedMetadata = localStorage.getItem(libraryStorageKey);

  if (!serializedMetadata) {
    const metadata = createEmptyLibraryMetadata();
    saveLocalLibraryMetadata(metadata);
    return metadata;
  }

  try {
    return JSON.parse(serializedMetadata) as LocalLibraryMetadata;
  } catch {
    const metadata = createEmptyLibraryMetadata();
    saveLocalLibraryMetadata(metadata);
    return metadata;
  }
}

//------------------------------------------------------------------------------
// Save Local Library Metadata
//------------------------------------------------------------------------------

function saveLocalLibraryMetadata(metadata: LocalLibraryMetadata) {
  localStorage.setItem(libraryStorageKey, JSON.stringify(metadata));
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
