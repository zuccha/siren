import { Box, Container, Flex, Grid, HStack, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TrackSection from "~/components/track-section";
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
  saveLocalTrack,
  updateLocalTrack,
} from "~/sound/local-tracks";
import { type Track } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";
import EditModeSwitch from "~/ui/edit-mode-switch";

//------------------------------------------------------------------------------
// Track Library
//------------------------------------------------------------------------------

type TrackLibrary = {
  ambienceTracks: Track[];
  environmentTracks: Track[];
  tracks: Track[];
};

const emptyTracks: Track[] = [];

//------------------------------------------------------------------------------
// App
//------------------------------------------------------------------------------

function App() {
  const [trackLibrary, setTrackLibrary] = useState<TrackLibrary>();
  const [isEditing, setIsEditing] = useState(false);
  const [playingIds, setPlayingIds] = useState<Set<string>>(() => new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  const activeSounds = useRef(new Map<string, ActiveSound>());
  const tracks = trackLibrary?.tracks ?? emptyTracks;
  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);

  useEffect(() => {
    void loadLocalTracks().then((localTracks) => {
      const ambienceTracks = localTracks.filter((track) => track.kind === "ambience");
      const environmentTracks = localTracks.filter((track) => track.kind === "environment");
      const loadedTracks = {
        ambienceTracks,
        environmentTracks,
        tracks: [...ambienceTracks, ...environmentTracks],
      };

      setTrackLibrary(loadedTracks);
      setVolumes(
        Object.fromEntries(loadedTracks.tracks.map((track) => [track.id, track.initialVolume])),
      );
    });
  }, []);

  const updateTrackLibrary = useCallback((updater: (previous: TrackLibrary) => TrackLibrary) => {
    setTrackLibrary((previous) => {
      if (previous) return updater(previous);

      return updater({
        ambienceTracks: [],
        environmentTracks: [],
        tracks: [],
      });
    });
  }, []);

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

        const loadedTracks = {
          ambienceTracks,
          environmentTracks,
          tracks: [...ambienceTracks, ...environmentTracks],
        };

        return loadedTracks;
      });
      setVolumes((previous) => ({ ...previous, [track.id]: track.initialVolume }));
    },
    [updateTrackLibrary],
  );

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

  const toggleTrack = useCallback(
    (track: Track) => {
      if (activeSounds.current.has(track.id)) stopTrack(track.id);
      else startTrack(track);
    },
    [startTrack, stopTrack],
  );

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setVolumes((previous) => ({ ...previous, [trackId]: volume }));
    const sound = activeSounds.current.get(trackId);
    if (sound) fadeSoundTo(sound, volume, 0.12);
  }, []);

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

        return {
          ambienceTracks,
          environmentTracks,
          tracks: [...ambienceTracks, ...environmentTracks],
        };
      });
      setTrackVolume(updatedTrack.id, updatedTrack.initialVolume);
    },
    [setTrackVolume, updateTrackLibrary],
  );

  const removeTrack = useCallback(
    (track: Track) => {
      stopTrack(track.id);
      void deleteLocalTrack(track.id);
      URL.revokeObjectURL(track.src);

      updateTrackLibrary((previous) => {
        const ambienceTracks = previous.ambienceTracks.filter((item) => item.id !== track.id);
        const environmentTracks = previous.environmentTracks.filter((item) => item.id !== track.id);

        return {
          ambienceTracks,
          environmentTracks,
          tracks: [...ambienceTracks, ...environmentTracks],
        };
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

  return (
    <Box minH="100vh" bg="bg.muted" color="fg">
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 5, md: 8 }}>
        <Flex align="center" justify="space-between" gap={4} mb={{ base: 2, md: 4 }}>
          <Box>
            <Heading as="h1" size={{ base: "xl", md: "2xl" }}>
              Siren
            </Heading>
          </Box>
          <HStack gap={3}>
            <EditModeSwitch isEditing={isEditing} onEditingChange={setIsEditing} />
            <ThemeButton />
          </HStack>
        </Flex>

        {trackLibrary && (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
            <TrackSection
              defaultIcon="music"
              kind="ambience"
              title="Ambience / Music"
              tracks={trackLibrary.ambienceTracks}
              isEditing={isEditing}
              playingIds={playingIds}
              volumes={volumes}
              onEdit={editTrack}
              onRemove={removeTrack}
              onToggle={toggleTrack}
              onUpload={addLocalTrack}
              onVolumeChange={setTrackVolume}
            />
            <TrackSection
              defaultIcon="wind"
              kind="environment"
              title="Environment"
              tracks={trackLibrary.environmentTracks}
              isEditing={isEditing}
              playingIds={playingIds}
              volumes={volumes}
              onEdit={editTrack}
              onRemove={removeTrack}
              onToggle={toggleTrack}
              onUpload={addLocalTrack}
              onVolumeChange={setTrackVolume}
            />
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;
