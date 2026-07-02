import { Container, Dialog, Em, HStack, Kbd, Portal, Stack, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";

import DocsImage from "~/components/docs-image";
import DocsSection from "~/components/docs-section";
import Button from "~/ui/button";

import ThemeButton from "../theme/theme-button";

//------------------------------------------------------------------------------
// About Page
//------------------------------------------------------------------------------

type AboutPageProps = {
  onClose: () => void;
};

export default function AboutPage({ onClose }: AboutPageProps) {
  return (
    <Dialog.Root open size="full" onOpenChange={(details) => !details.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content aria-label="About SirenSong" bg="bg" color="fg" overflowY="auto">
            <Container maxW="4xl" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
              <HStack justify="space-between" mb={6}>
                <Button aria-label="Back to mixer" onClick={onClose} size="sm" variant="outline">
                  <ChevronLeftIcon />
                  Back
                </Button>

                <ThemeButton />
              </HStack>

              <Text fontFamily="Nautilus" fontSize={{ base: "3xl", md: "4xl" }} mb={4}>
                SirenSong
              </Text>

              <Stack gap={6}>
                <Stack gap={1}>
                  <Text>
                    <Em>SirenSong</Em> is a local sound mixer for tabletop sessions. It lets you
                    prepare playlists, play ambience or music, layer environmental sounds, and
                    control the full mix while running a game.
                  </Text>
                  <Text>
                    All tracks are saved locally on your device, <Em>SirenSong</Em> doesn't store or
                    collect user data of any kind.
                  </Text>
                </Stack>

                <DocsSection
                  title="How the app is organized"
                  visual={
                    <DocsImage
                      alt="Playlist chips"
                      caption="Playlists hold the sound setup for a place, encounter, or session beat"
                      maxW="20em"
                      src="/images/docs/playlist-chips.png"
                    />
                  }
                >
                  <Text>
                    Playlists are the top-level structure. Each playlist contains ambience tracks
                    and environment tracks, with volume settings saved per playlist.
                  </Text>
                  <Text>
                    Tracks are reusable audio files saved in this browser. The same track can appear
                    in multiple playlists, while its volume can be tuned differently in each one.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Build a playlist"
                  visual={
                    <DocsImage
                      alt="Add track panel"
                      caption="Add tracks from audio files or reuse tracks already saved in the library"
                      maxW="30em"
                      src="/images/docs/add-track.png"
                    />
                  }
                >
                  <Text>
                    Add sounds directly from audio files or reuse tracks that are already in the
                    library. Ambience is for music or mood beds, and environment is for layered
                    sounds such as rain, wind, crowds, or fire.
                  </Text>
                  <Text>
                    Only one ambience track plays at a time. Environment tracks can play together,
                    which makes them useful for building a location from several sound layers.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Run a scene"
                  visual={
                    <DocsImage
                      alt="Play Scene button"
                      caption="Play Scene starts a prepared playlist in one action"
                      maxW="12em"
                      src="/images/docs/play-scene-button.png"
                    />
                  }
                >
                  <Text>
                    A playlist with only one ambience track can be played as a scene. Use it when a
                    playlist is meant to start as a complete sound setup rather than something you
                    mix track by track.
                  </Text>
                  <Text>
                    Starting a scene plays its environment tracks together and includes the ambience
                    track when there is exactly one.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Mix during the session"
                  visual={
                    <DocsImage
                      alt="Track controls"
                      caption="Each track has playback, mute, and volume controls"
                      maxW="20em"
                      src="/images/docs/track-controls.png"
                    />
                  }
                >
                  <Text>
                    Each track has play, mute, and volume controls for live adjustments. Starting
                    another ambience track fades the current one out while the new one fades in.
                  </Text>
                  <Text>
                    The master control adjusts the whole mix and can pause or resume everything
                    currently playing.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Edit playlists and tracks"
                  visual={
                    <DocsImage
                      alt="Edit and Done buttons"
                      caption="Edit opens playlist and track editing controls, Done returns to playback"
                      maxW="16em"
                      src="/images/docs/edit-button.png"
                    />
                  }
                >
                  <Text>
                    Edit mode is where you rename playlists, reorder tracks, remove tracks from a
                    playlist, and change track details.
                  </Text>
                  <Text>
                    Track name, icon, audio file, track type, and default volume belong to the track
                    itself. Playlist volume can still be tuned independently, so the same sound can
                    be balanced differently depending on where it is used.
                  </Text>
                </DocsSection>

                <DocsSection title="Manage the track library">
                  <Text>
                    Open Tracks from the top bar to manage every saved track. The library can be
                    searched, filtered by ambience or environment, edited, and used to delete tracks
                    from the device.
                  </Text>
                  <Text>
                    If a track is deleted from the library, it is removed from playlists as well.
                  </Text>
                </DocsSection>

                <Stack gap={2}>
                  <Text fontWeight="semibold">Shortcuts</Text>
                  <Stack gap={2}>
                    <HStack gap={2}>
                      <Kbd>E</Kbd>
                      <Text>Toggle edit mode</Text>
                    </HStack>
                    <HStack gap={2}>
                      <Kbd>P</Kbd>
                      <Text>Pause or resume the master player</Text>
                    </HStack>
                  </Stack>
                </Stack>

                <DocsSection title="Credits">
                  <Text>App created by zuccha.</Text>
                  <Text>
                    Preset ambience tracks by Alexander Nakarada (
                    <a href="(https://creatorchords.com)" target="_blank">
                      https://creatorchords.com
                    </a>
                    ).
                  </Text>
                  <Text>
                    Preset environment tracks by Bruno Boselli, Dragon Studio, and Ramon Mineiro.
                  </Text>
                </DocsSection>
              </Stack>
            </Container>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
