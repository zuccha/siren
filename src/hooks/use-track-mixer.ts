import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type ActiveSound,
  createSound,
  fadeOutAndStop,
  fadeSoundTo,
  pauseSound,
  resumeSound,
  setSoundMasterMuted,
  setSoundMasterVolume,
  setSoundMuted,
  stopSound,
} from "~/sound/audio";
import {
  type LocalTrackInput,
  type LocalTrackUpdateInput,
  addLocalPlaylistTrack,
  deleteLocalPlaylist,
  deleteLocalTrack,
  loadLocalTrackLibrary,
  removeLocalPlaylistTrack,
  reorderLocalPlaylistTracks,
  saveLocalPlaylist,
  saveLocalTrack,
  updateLocalPlaylist,
  updateLocalPlaylistTrackVolume,
  updateLocalTrack,
} from "~/sound/local-tracks";
import {
  type Track,
  type TrackDropPosition,
  type TrackKind,
  type TrackPlaylist,
} from "~/sound/tracks";

//------------------------------------------------------------------------------
// Track Library
//------------------------------------------------------------------------------

type TrackLibrary = {
  ambienceTracks: Track[];
  environmentTracks: Track[];
  tracks: Track[];
};

//------------------------------------------------------------------------------
// Mixer Library
//------------------------------------------------------------------------------

type MixerLibrary = {
  playlists: TrackPlaylist[];
  tracks: Track[];
};

const emptyMixerLibrary: MixerLibrary = {
  playlists: [],
  tracks: [],
};

const emptyTrackLibrary: TrackLibrary = {
  ambienceTracks: [],
  environmentTracks: [],
  tracks: [],
};

const selectedPlaylistStorageKey = "siren.selected-playlist-id";

//------------------------------------------------------------------------------
// Create Track Library
//------------------------------------------------------------------------------

function createTrackLibrary(ambienceTracks: Track[], environmentTracks: Track[]): TrackLibrary {
  return {
    ambienceTracks,
    environmentTracks,
    tracks: [...ambienceTracks, ...environmentTracks],
  };
}

//------------------------------------------------------------------------------
// Reorder Track List
//------------------------------------------------------------------------------

function reorderTrackList(
  tracks: Track[],
  sourceId: string,
  targetId: string,
  position: TrackDropPosition,
) {
  const sourceIndex = tracks.findIndex((track) => track.id === sourceId);
  const targetIndex = tracks.findIndex((track) => track.id === targetId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return tracks;

  const nextTracks = [...tracks];
  const [movedTrack] = nextTracks.splice(sourceIndex, 1);
  if (!movedTrack) return tracks;

  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = position === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  nextTracks.splice(insertIndex, 0, movedTrack);

  return nextTracks;
}

//------------------------------------------------------------------------------
// Get Playlist Track Ids
//------------------------------------------------------------------------------

function getPlaylistTrackIds(playlist: TrackPlaylist | undefined, kind: TrackKind) {
  if (!playlist) return [];
  return kind === "ambience" ? playlist.ambienceTrackIds : playlist.environmentTrackIds;
}

//------------------------------------------------------------------------------
// Get Playlist Volumes
//------------------------------------------------------------------------------

function getPlaylistVolumes(playlist: TrackPlaylist | undefined) {
  return playlist?.volumes ?? {};
}

//------------------------------------------------------------------------------
// Get Track Volume
//------------------------------------------------------------------------------

function getTrackVolume(playlist: TrackPlaylist | undefined, track: Track) {
  return getPlaylistVolumes(playlist)[track.id] ?? track.initialVolume;
}

//------------------------------------------------------------------------------
// Set Playlist Track Ids
//------------------------------------------------------------------------------

function setPlaylistTrackIds(playlist: TrackPlaylist, kind: TrackKind, trackIds: string[]) {
  if (kind === "ambience") return { ...playlist, ambienceTrackIds: trackIds };
  return { ...playlist, environmentTrackIds: trackIds };
}

//------------------------------------------------------------------------------
// Sort Playlists
//------------------------------------------------------------------------------

function sortPlaylists(playlists: TrackPlaylist[]) {
  return [...playlists].sort((firstPlaylist, secondPlaylist) =>
    firstPlaylist.name.localeCompare(secondPlaylist.name, undefined, { sensitivity: "base" }),
  );
}

//------------------------------------------------------------------------------
// Load Selected Playlist Id
//------------------------------------------------------------------------------

function loadSelectedPlaylistId() {
  return localStorage.getItem(selectedPlaylistStorageKey) ?? undefined;
}

//------------------------------------------------------------------------------
// Save Selected Playlist Id
//------------------------------------------------------------------------------

function saveSelectedPlaylistId(playlistId: string | undefined) {
  if (playlistId) localStorage.setItem(selectedPlaylistStorageKey, playlistId);
  else localStorage.removeItem(selectedPlaylistStorageKey);
}

//------------------------------------------------------------------------------
// Use Track Mixer
//------------------------------------------------------------------------------

export default function useTrackMixer() {
  const [library, setLibrary] = useState<MixerLibrary>();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>();
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(100);
  const [mutedTrackIds, setMutedTrackIds] = useState<Set<string>>(() => new Set());
  const [playingIds, setPlayingIds] = useState<Set<string>>(() => new Set());

  const activeSounds = useRef(new Map<string, ActiveSound>());
  const activePlaylistId = useRef<string | undefined>(undefined);
  const loadedLibrary = library ?? emptyMixerLibrary;
  const playlists = useMemo(
    () => sortPlaylists(loadedLibrary.playlists),
    [loadedLibrary.playlists],
  );
  const selectedPlaylist =
    playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? playlists[0];
  const tracks = loadedLibrary.tracks;
  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
  const trackLibrary = useMemo(() => {
    const ambienceTracks = getPlaylistTrackIds(selectedPlaylist, "ambience")
      .map((trackId) => trackById.get(trackId))
      .filter((track): track is Track => Boolean(track));
    const environmentTracks = getPlaylistTrackIds(selectedPlaylist, "environment")
      .map((trackId) => trackById.get(trackId))
      .filter((track): track is Track => Boolean(track));

    return createTrackLibrary(ambienceTracks, environmentTracks);
  }, [selectedPlaylist, trackById]);
  const volumes = useMemo(() => getPlaylistVolumes(selectedPlaylist), [selectedPlaylist]);
  const selectedPlaylistPlayingIds = useMemo(() => {
    if (activePlaylistId.current !== selectedPlaylist?.id) return new Set<string>();
    return playingIds;
  }, [playingIds, selectedPlaylist?.id]);

  useEffect(() => {
    void loadLocalTrackLibrary().then((localLibrary) => {
      const sortedPlaylists = sortPlaylists(localLibrary.playlists);
      const storedPlaylistId = loadSelectedPlaylistId();
      const selectedPlaylistId =
        sortedPlaylists.find((playlist) => playlist.id === storedPlaylistId)?.id ??
        sortedPlaylists[0]?.id;

      setLibrary({ ...localLibrary, playlists: sortedPlaylists });
      setSelectedPlaylistId(selectedPlaylistId);
      saveSelectedPlaylistId(selectedPlaylistId);
    });
  }, []);

  //------------------------------------------------------------------------------
  // Update Library
  //------------------------------------------------------------------------------

  const updateLibrary = useCallback((updater: (previous: MixerLibrary) => MixerLibrary) => {
    setLibrary((previous) => updater(previous ?? emptyMixerLibrary));
  }, []);

  //------------------------------------------------------------------------------
  // Stop All Tracks
  //------------------------------------------------------------------------------

  const stopAllTracks = useCallback(() => {
    for (const sound of activeSounds.current.values()) {
      stopSound(sound);
    }

    activeSounds.current.clear();
    activePlaylistId.current = undefined;
    setPlayingIds(new Set());
  }, []);

  //------------------------------------------------------------------------------
  // Fade Out All Tracks
  //------------------------------------------------------------------------------

  const fadeOutAllTracks = useCallback(() => {
    for (const sound of activeSounds.current.values()) {
      fadeOutAndStop(sound);
    }

    activeSounds.current.clear();
    activePlaylistId.current = undefined;
    setPlayingIds(new Set());
  }, []);

  //------------------------------------------------------------------------------
  // Select Playlist
  //------------------------------------------------------------------------------

  const selectPlaylist = useCallback((playlistId: string | undefined) => {
    setSelectedPlaylistId(playlistId);
    saveSelectedPlaylistId(playlistId);
  }, []);

  //------------------------------------------------------------------------------
  // Add Playlist
  //------------------------------------------------------------------------------

  const addPlaylist = useCallback(
    (name: string) => {
      const playlist = saveLocalPlaylist(name);
      updateLibrary((previous) => ({
        ...previous,
        playlists: sortPlaylists([...previous.playlists, playlist]),
      }));
      setSelectedPlaylistId(playlist.id);
      saveSelectedPlaylistId(playlist.id);
    },
    [updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Edit Playlist
  //------------------------------------------------------------------------------

  const editPlaylist = useCallback(
    (playlistId: string, name: string) => {
      const playlist = updateLocalPlaylist(playlistId, name);
      if (!playlist) return;

      updateLibrary((previous) => ({
        ...previous,
        playlists: sortPlaylists(
          previous.playlists.map((item) => (item.id === playlist.id ? playlist : item)),
        ),
      }));
    },
    [updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Remove Playlist
  //------------------------------------------------------------------------------

  const removePlaylist = useCallback(
    (playlistId: string) => {
      deleteLocalPlaylist(playlistId);
      updateLibrary((previous) => {
        const playlists = previous.playlists.filter((playlist) => playlist.id !== playlistId);
        setSelectedPlaylistId((current) => {
          if (current !== playlistId) return current;

          if (activePlaylistId.current === playlistId) stopAllTracks();
          saveSelectedPlaylistId(playlists[0]?.id);
          return playlists[0]?.id;
        });

        return { ...previous, playlists };
      });
    },
    [stopAllTracks, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Add Track To Playlist
  //------------------------------------------------------------------------------

  const addTrackToPlaylist = useCallback(
    (track: Track) => {
      if (!selectedPlaylist) return;

      addLocalPlaylistTrack(selectedPlaylist.id, track);
      updateLibrary((previous) => ({
        ...previous,
        playlists: previous.playlists.map((playlist) => {
          if (playlist.id !== selectedPlaylist.id) return playlist;

          const trackIds = getPlaylistTrackIds(playlist, track.kind);
          if (trackIds.includes(track.id)) return playlist;

          return {
            ...setPlaylistTrackIds(playlist, track.kind, [...trackIds, track.id]),
            volumes: {
              ...getPlaylistVolumes(playlist),
              [track.id]: track.initialVolume,
            },
          };
        }),
      }));
    },
    [selectedPlaylist, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Add Local Track
  //------------------------------------------------------------------------------

  const addLocalTrack = useCallback(
    async (input: LocalTrackInput) => {
      const track = await saveLocalTrack(input);
      if (selectedPlaylist) addLocalPlaylistTrack(selectedPlaylist.id, track);

      updateLibrary((previous) => ({
        ...previous,
        playlists: previous.playlists.map((playlist) => {
          if (playlist.id !== selectedPlaylist?.id) return playlist;
          return {
            ...setPlaylistTrackIds(playlist, track.kind, [
              ...getPlaylistTrackIds(playlist, track.kind),
              track.id,
            ]),
            volumes: {
              ...getPlaylistVolumes(playlist),
              [track.id]: track.initialVolume,
            },
          };
        }),
        tracks: [...previous.tracks, track],
      }));
    },
    [selectedPlaylist, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Add Library Track
  //------------------------------------------------------------------------------

  const addLibraryTrack = useCallback(
    async (input: LocalTrackInput) => {
      const track = await saveLocalTrack(input);

      updateLibrary((previous) => ({
        ...previous,
        tracks: [...previous.tracks, track],
      }));
    },
    [updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Remove Track From Playlist
  //------------------------------------------------------------------------------

  const removeTrackFromPlaylist = useCallback(
    (track: Track) => {
      if (!selectedPlaylist) return;

      removeLocalPlaylistTrack(selectedPlaylist.id, track.id);
      updateLibrary((previous) => ({
        ...previous,
        playlists: previous.playlists.map((playlist) => {
          if (playlist.id !== selectedPlaylist.id) return playlist;
          const { [track.id]: _removedVolume, ...volumes } = getPlaylistVolumes(playlist);

          return {
            ...setPlaylistTrackIds(
              playlist,
              track.kind,
              getPlaylistTrackIds(playlist, track.kind).filter((trackId) => trackId !== track.id),
            ),
            volumes,
          };
        }),
      }));
    },
    [selectedPlaylist, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Stop Track
  //------------------------------------------------------------------------------

  const stopTrack = useCallback(
    (trackId: string) => {
      const sound = activeSounds.current.get(trackId);
      if (!sound) return;

      const track = trackById.get(trackId);

      if (track?.kind === "ambience") fadeOutAndStop(sound);
      else stopSound(sound);

      activeSounds.current.delete(trackId);
      if (activeSounds.current.size === 0) activePlaylistId.current = undefined;
      setPlayingIds((previous) => {
        const next = new Set(previous);
        next.delete(trackId);
        return next;
      });
    },
    [trackById],
  );

  //------------------------------------------------------------------------------
  // Resume Active Sounds
  //------------------------------------------------------------------------------

  const resumeActiveSounds = useCallback(() => {
    for (const sound of activeSounds.current.values()) {
      resumeSound(sound);
    }

    setIsPaused(false);
  }, []);

  //------------------------------------------------------------------------------
  // Start Track
  //------------------------------------------------------------------------------

  const startTrack = useCallback(
    (track: Track) => {
      if (!selectedPlaylist) return;
      if (track.hasMissingAudio) return;

      if (isPaused) resumeActiveSounds();

      if (activePlaylistId.current && activePlaylistId.current !== selectedPlaylist.id) {
        fadeOutAllTracks();
      }

      if (track.kind === "ambience") {
        for (const activeId of activeSounds.current.keys()) {
          const activeTrack = trackById.get(activeId);
          if (activeTrack?.kind === "ambience") stopTrack(activeId);
        }
      }

      const sound = createSound(track, getTrackVolume(selectedPlaylist, track), {
        fadeIn: true,
        isMasterMuted,
        isMuted: mutedTrackIds.has(track.id),
        masterVolume,
      });

      activeSounds.current.set(track.id, sound);
      activePlaylistId.current = selectedPlaylist.id;
      setPlayingIds((previous) => new Set(previous).add(track.id));
    },
    [
      isMasterMuted,
      isPaused,
      masterVolume,
      mutedTrackIds,
      resumeActiveSounds,
      selectedPlaylist,
      fadeOutAllTracks,
      stopTrack,
      trackById,
    ],
  );

  //------------------------------------------------------------------------------
  // Toggle Track
  //------------------------------------------------------------------------------

  const toggleTrack = useCallback(
    (track: Track) => {
      const isPlayingInSelectedPlaylist =
        activePlaylistId.current === selectedPlaylist?.id && activeSounds.current.has(track.id);

      if (isPlayingInSelectedPlaylist) stopTrack(track.id);
      else startTrack(track);
    },
    [selectedPlaylist, startTrack, stopTrack],
  );

  //------------------------------------------------------------------------------
  // Set Track Volume
  //------------------------------------------------------------------------------

  const setTrackVolume = useCallback(
    (trackId: string, volume: number) => {
      if (!selectedPlaylist) return;

      updateLocalPlaylistTrackVolume(selectedPlaylist.id, trackId, volume);
      updateLibrary((previous) => ({
        ...previous,
        playlists: previous.playlists.map((playlist) =>
          playlist.id === selectedPlaylist.id
            ? {
                ...playlist,
                volumes: {
                  ...getPlaylistVolumes(playlist),
                  [trackId]: volume,
                },
              }
            : playlist,
        ),
      }));

      const sound =
        activePlaylistId.current === selectedPlaylist.id
          ? activeSounds.current.get(trackId)
          : undefined;
      if (sound) fadeSoundTo(sound, volume, 0.12);
    },
    [selectedPlaylist, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Set Master Volume
  //------------------------------------------------------------------------------

  const setMasterVolume = useCallback((volume: number) => {
    setMasterVolumeState(volume);

    for (const sound of activeSounds.current.values()) {
      setSoundMasterVolume(sound, volume);
    }
  }, []);

  //------------------------------------------------------------------------------
  // Toggle Master Mute
  //------------------------------------------------------------------------------

  const toggleMasterMute = useCallback(() => {
    setIsMasterMuted((current) => {
      const next = !current;

      for (const sound of activeSounds.current.values()) {
        setSoundMasterMuted(sound, next);
      }

      return next;
    });
  }, []);

  //------------------------------------------------------------------------------
  // Toggle Track Mute
  //------------------------------------------------------------------------------

  const toggleTrackMute = useCallback((trackId: string) => {
    setMutedTrackIds((previous) => {
      const next = new Set(previous);
      const isMuted = !next.has(trackId);

      if (isMuted) next.add(trackId);
      else next.delete(trackId);

      const sound = activeSounds.current.get(trackId);
      if (sound) setSoundMuted(sound, isMuted);

      return next;
    });
  }, []);

  //------------------------------------------------------------------------------
  // Pause All
  //------------------------------------------------------------------------------

  const pauseAll = useCallback(() => {
    for (const sound of activeSounds.current.values()) {
      pauseSound(sound);
    }

    setIsPaused(true);
  }, []);

  //------------------------------------------------------------------------------
  // Resume All
  //------------------------------------------------------------------------------

  const resumeAll = useCallback(() => {
    resumeActiveSounds();
  }, [resumeActiveSounds]);

  //------------------------------------------------------------------------------
  // Toggle Pause All
  //------------------------------------------------------------------------------

  const togglePauseAll = useCallback(() => {
    if (isPaused) resumeAll();
    else pauseAll();
  }, [isPaused, pauseAll, resumeAll]);

  //------------------------------------------------------------------------------
  // Edit Track
  //------------------------------------------------------------------------------

  const editTrack = useCallback(
    async (track: Track, input: LocalTrackUpdateInput) => {
      if (input.file && activeSounds.current.has(track.id)) stopTrack(track.id);

      const updatedTrack = await updateLocalTrack(track, input);

      updateLibrary((previous) => ({
        ...previous,
        tracks: previous.tracks.map((item) => (item.id === updatedTrack.id ? updatedTrack : item)),
      }));
    },
    [stopTrack, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Delete Track
  //------------------------------------------------------------------------------

  const deleteTrack = useCallback(
    async (track: Track) => {
      stopTrack(track.id);
      await deleteLocalTrack(track.id);

      updateLibrary((previous) => ({
        playlists: previous.playlists.map((playlist) => {
          const { [track.id]: _removedVolume, ...volumes } = getPlaylistVolumes(playlist);

          return {
            ...setPlaylistTrackIds(
              setPlaylistTrackIds(
                playlist,
                "ambience",
                playlist.ambienceTrackIds.filter((trackId) => trackId !== track.id),
              ),
              "environment",
              playlist.environmentTrackIds.filter((trackId) => trackId !== track.id),
            ),
            volumes,
          };
        }),
        tracks: previous.tracks.filter((item) => item.id !== track.id),
      }));
      setMutedTrackIds((previous) => {
        const next = new Set(previous);
        next.delete(track.id);
        return next;
      });
    },
    [stopTrack, updateLibrary],
  );

  //------------------------------------------------------------------------------
  // Reorder Tracks
  //------------------------------------------------------------------------------

  const reorderTracks = useCallback(
    (kind: TrackKind, sourceId: string, targetId: string, position: TrackDropPosition) => {
      if (!selectedPlaylist) return;

      const sectionTracks =
        kind === "ambience" ? trackLibrary.ambienceTracks : trackLibrary.environmentTracks;
      const reorderedTracks = reorderTrackList(sectionTracks, sourceId, targetId, position);
      const trackIds = reorderedTracks.map((track) => track.id);

      reorderLocalPlaylistTracks(selectedPlaylist.id, kind, trackIds);
      updateLibrary((previous) => ({
        ...previous,
        playlists: previous.playlists.map((playlist) =>
          playlist.id === selectedPlaylist.id
            ? setPlaylistTrackIds(playlist, kind, trackIds)
            : playlist,
        ),
      }));
    },
    [selectedPlaylist, trackLibrary.ambienceTracks, trackLibrary.environmentTracks, updateLibrary],
  );

  useEffect(() => {
    const sounds = activeSounds.current;

    return () => {
      for (const sound of sounds.values()) stopSound(sound);
      sounds.clear();
    };
  }, []);

  return {
    addLibraryTrack,
    addLocalTrack,
    addPlaylist,
    addTrackToPlaylist,
    deleteTrack,
    editPlaylist,
    editTrack,
    isLoaded: library !== undefined,
    isMasterMuted,
    isPaused,
    masterVolume,
    mutedTrackIds,
    playlists,
    playingPlaylistId: activePlaylistId.current,
    playingIds: selectedPlaylistPlayingIds,
    removePlaylist,
    removeTrackFromPlaylist,
    reorderTracks,
    selectedPlaylist,
    selectedPlaylistId,
    setMasterVolume,
    setSelectedPlaylistId: selectPlaylist,
    setTrackVolume,
    toggleMasterMute,
    togglePauseAll,
    toggleTrack,
    toggleTrackMute,
    trackLibrary: library ? trackLibrary : emptyTrackLibrary,
    tracks,
    volumes,
  };
}
