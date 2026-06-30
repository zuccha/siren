import { Box, Container, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TrackSection from "~/components/track-section";
import {
  type ActiveSound,
  createSound,
  fadeOutAndStop,
  fadeSoundTo,
  stopSound,
} from "~/sound/audio";
import { type Track, loadTracks } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";

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
  const [loadError, setLoadError] = useState<string>();
  const [playingIds, setPlayingIds] = useState<Set<string>>(() => new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});

  const activeSounds = useRef(new Map<string, ActiveSound>());
  const tracks = trackLibrary?.tracks ?? emptyTracks;
  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);

  useEffect(() => {
    void loadTracks()
      .then((loadedTracks) => {
        setTrackLibrary(loadedTracks);
        setVolumes(
          Object.fromEntries(loadedTracks.tracks.map((track) => [track.id, track.initialVolume])),
        );
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Could not load track manifest");
      });
  }, []);

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
        <Flex align="center" justify="space-between" gap={4} mb={{ base: 6, md: 8 }}>
          <Box>
            <Heading as="h1" size={{ base: "xl", md: "2xl" }}>
              Siren
            </Heading>
          </Box>
          <ThemeButton />
        </Flex>

        {loadError && <Text color="fg.error">{loadError}</Text>}

        {!trackLibrary && !loadError && <Text color="fg.muted">Loading tracks...</Text>}

        {trackLibrary && (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
            <TrackSection
              title="Ambience / Music"
              tracks={trackLibrary.ambienceTracks}
              playingIds={playingIds}
              volumes={volumes}
              onToggle={toggleTrack}
              onVolumeChange={setTrackVolume}
            />
            <TrackSection
              title="Environment"
              tracks={trackLibrary.environmentTracks}
              playingIds={playingIds}
              volumes={volumes}
              onToggle={toggleTrack}
              onVolumeChange={setTrackVolume}
            />
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;
