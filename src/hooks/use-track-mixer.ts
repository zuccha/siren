import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type ActiveSound,
  createSound,
  fadeOutAndStop,
  fadeSoundTo,
  stopSound,
} from "~/sound/audio";
import {
  type LocalTrackInput,
  type LocalTrackUpdateInput,
  deleteLocalTrack,
  loadLocalTracks,
  reorderLocalTracks,
  saveLocalTrack,
  updateLocalTrack,
} from "~/sound/local-tracks";
import { type Track, type TrackDropPosition } from "~/sound/tracks";

//------------------------------------------------------------------------------
// Track Library
//------------------------------------------------------------------------------

type TrackLibrary = {
  ambienceTracks: Track[];
  environmentTracks: Track[];
  tracks: Track[];
};

const emptyTrackLibrary: TrackLibrary = {
  ambienceTracks: [],
  environmentTracks: [],
  tracks: [],
};

const emptyTracks: Track[] = [];

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
// Use Track Mixer
//------------------------------------------------------------------------------

export default function useTrackMixer() {
  const [trackLibrary, setTrackLibrary] = useState<TrackLibrary>();
  const [playingIds, setPlayingIds] = useState<Set<string>>(() => new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  const activeSounds = useRef(new Map<string, ActiveSound>());
  const tracks = trackLibrary?.tracks ?? emptyTracks;
  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);

  useEffect(() => {
    void loadLocalTracks().then((localTracks) => {
      const ambienceTracks = localTracks.filter((track) => track.kind === "ambience");
      const environmentTracks = localTracks.filter((track) => track.kind === "environment");
      const loadedTrackLibrary = createTrackLibrary(ambienceTracks, environmentTracks);

      setTrackLibrary(loadedTrackLibrary);
      setVolumes(
        Object.fromEntries(
          loadedTrackLibrary.tracks.map((track) => [track.id, track.initialVolume]),
        ),
      );
    });
  }, []);

  //------------------------------------------------------------------------------
  // Update Track Library
  //------------------------------------------------------------------------------

  const updateTrackLibrary = useCallback((updater: (previous: TrackLibrary) => TrackLibrary) => {
    setTrackLibrary((previous) => updater(previous ?? emptyTrackLibrary));
  }, []);

  //------------------------------------------------------------------------------
  // Add Local Track
  //------------------------------------------------------------------------------

  const addLocalTrack = useCallback(
    async (input: LocalTrackInput) => {
      const track = await saveLocalTrack(input);

      updateTrackLibrary((previous) => {
        const ambienceTracks =
          track.kind === "ambience" ? [...previous.ambienceTracks, track] : previous.ambienceTracks;
        const environmentTracks =
          track.kind === "environment"
            ? [...previous.environmentTracks, track]
            : previous.environmentTracks;

        return createTrackLibrary(ambienceTracks, environmentTracks);
      });
      setVolumes((previous) => ({ ...previous, [track.id]: track.initialVolume }));
    },
    [updateTrackLibrary],
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
      setPlayingIds((previous) => {
        const next = new Set(previous);
        next.delete(trackId);
        return next;
      });
    },
    [trackById],
  );

  //------------------------------------------------------------------------------
  // Start Track
  //------------------------------------------------------------------------------

  const startTrack = useCallback(
    (track: Track) => {
      if (track.kind === "ambience") {
        for (const activeId of activeSounds.current.keys()) {
          const activeTrack = trackById.get(activeId);
          if (activeTrack?.kind === "ambience") stopTrack(activeId);
        }
      }

      const sound = createSound(track, volumes[track.id] ?? track.initialVolume, {
        fadeIn: true,
      });
      activeSounds.current.set(track.id, sound);
      setPlayingIds((previous) => new Set(previous).add(track.id));
    },
    [stopTrack, trackById, volumes],
  );

  //------------------------------------------------------------------------------
  // Toggle Track
  //------------------------------------------------------------------------------

  const toggleTrack = useCallback(
    (track: Track) => {
      if (activeSounds.current.has(track.id)) stopTrack(track.id);
      else startTrack(track);
    },
    [startTrack, stopTrack],
  );

  //------------------------------------------------------------------------------
  // Set Track Volume
  //------------------------------------------------------------------------------

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setVolumes((previous) => ({ ...previous, [trackId]: volume }));
    const sound = activeSounds.current.get(trackId);
    if (sound) fadeSoundTo(sound, volume, 0.12);
  }, []);

  //------------------------------------------------------------------------------
  // Edit Track
  //------------------------------------------------------------------------------

  const editTrack = useCallback(
    (track: Track, input: LocalTrackUpdateInput) => {
      const updatedTrack = updateLocalTrack(track, input);

      updateTrackLibrary((previous) => {
        const ambienceTracks = previous.ambienceTracks.map((item) =>
          item.id === updatedTrack.id ? updatedTrack : item,
        );
        const environmentTracks = previous.environmentTracks.map((item) =>
          item.id === updatedTrack.id ? updatedTrack : item,
        );

        return createTrackLibrary(ambienceTracks, environmentTracks);
      });
      setTrackVolume(updatedTrack.id, updatedTrack.initialVolume);
    },
    [setTrackVolume, updateTrackLibrary],
  );

  //------------------------------------------------------------------------------
  // Reorder Tracks
  //------------------------------------------------------------------------------

  const reorderTracks = useCallback(
    (kind: Track["kind"], sourceId: string, targetId: string, position: TrackDropPosition) => {
      updateTrackLibrary((previous) => {
        const ambienceTracks =
          kind === "ambience"
            ? reorderTrackList(previous.ambienceTracks, sourceId, targetId, position)
            : previous.ambienceTracks;
        const environmentTracks =
          kind === "environment"
            ? reorderTrackList(previous.environmentTracks, sourceId, targetId, position)
            : previous.environmentTracks;

        reorderLocalTracks(
          kind,
          (kind === "ambience" ? ambienceTracks : environmentTracks).map((track) => track.id),
        );

        return createTrackLibrary(ambienceTracks, environmentTracks);
      });
    },
    [updateTrackLibrary],
  );

  //------------------------------------------------------------------------------
  // Remove Track
  //------------------------------------------------------------------------------

  const removeTrack = useCallback(
    (track: Track) => {
      stopTrack(track.id);
      void deleteLocalTrack(track.id);
      URL.revokeObjectURL(track.src);

      updateTrackLibrary((previous) => {
        const ambienceTracks = previous.ambienceTracks.filter((item) => item.id !== track.id);
        const environmentTracks = previous.environmentTracks.filter((item) => item.id !== track.id);

        return createTrackLibrary(ambienceTracks, environmentTracks);
      });
      setVolumes((previous) => {
        const next = { ...previous };
        delete next[track.id];
        return next;
      });
    },
    [stopTrack, updateTrackLibrary],
  );

  useEffect(() => {
    const sounds = activeSounds.current;

    return () => {
      for (const sound of sounds.values()) stopSound(sound);
      sounds.clear();
    };
  }, []);

  return {
    addLocalTrack,
    editTrack,
    isLoaded: trackLibrary !== undefined,
    playingIds,
    removeTrack,
    reorderTracks,
    toggleTrack,
    trackLibrary: trackLibrary ?? emptyTrackLibrary,
    setTrackVolume,
    volumes,
  };
}
