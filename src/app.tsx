import { Box, Container, Flex, Grid, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TrackSection from "~/components/track-section";
import { type ActiveSound, createSound, fadeOutAndStop, stopSound } from "~/sound/audio";
import { type Track, ambienceTracks, environmentTracks, tracks } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";

//------------------------------------------------------------------------------
// App
//------------------------------------------------------------------------------

function App() {
  const [playingIds, setPlayingIds] = useState<Set<string>>(() => new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>(() =>
    Object.fromEntries(tracks.map((track) => [track.id, track.initialVolume])),
  );

  const activeSounds = useRef(new Map<string, ActiveSound>());

  const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), []);

  const stopTrack = useCallback(
    (trackId: string) => {
      const sound = activeSounds.current.get(trackId);

      if (!sound) {
        return;
      }

      const track = trackById.get(trackId);

      if (track?.kind === "ambience") {
        fadeOutAndStop(sound);
      } else {
        stopSound(sound);
      }

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

          if (activeTrack?.kind === "ambience") {
            stopTrack(activeId);
          }
        }
      }

      const sound = createSound(track, volumes[track.id] ?? track.initialVolume, {
        fadeIn: track.kind === "ambience",
      });
      activeSounds.current.set(track.id, sound);
      setPlayingIds((previous) => new Set(previous).add(track.id));
    },
    [stopTrack, trackById, volumes],
  );

  const toggleTrack = useCallback(
    (track: Track) => {
      if (activeSounds.current.has(track.id)) {
        stopTrack(track.id);
        return;
      }

      startTrack(track);
    },
    [startTrack, stopTrack],
  );

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setVolumes((previous) => ({ ...previous, [trackId]: volume }));

    const sound = activeSounds.current.get(trackId);
    if (sound) {
      sound.output.gain.value = volume / 100;
    }
  }, []);

  useEffect(() => {
    const sounds = activeSounds.current;

    return () => {
      for (const sound of sounds.values()) {
        stopSound(sound);
      }

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

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
          <TrackSection
            title="Ambience / Music"
            tracks={ambienceTracks}
            playingIds={playingIds}
            volumes={volumes}
            onToggle={toggleTrack}
            onVolumeChange={setTrackVolume}
          />
          <TrackSection
            title="Environment"
            tracks={environmentTracks}
            playingIds={playingIds}
            volumes={volumes}
            onToggle={toggleTrack}
            onVolumeChange={setTrackVolume}
          />
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
