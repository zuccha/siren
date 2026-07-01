import {
  Container,
  Dialog,
  Em,
  Flex,
  Heading,
  HStack,
  Kbd,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { XIcon } from "lucide-react";

import DocsImage from "~/components/docs-image";
import DocsSection from "~/components/docs-section";
import IconButton from "~/ui/icon-button";

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
          <Dialog.Content bg="bg" color="fg" overflowY="auto">
            <Container maxW="4xl" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
              <Flex align="center" gap={4} justify="space-between" mb={4}>
                <Dialog.Title asChild>
                  <Heading as="h1" size="2xl">
                    About SirenSong
                  </Heading>
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <IconButton Icon={XIcon} aria-label="Close about page" variant="ghost" />
                </Dialog.CloseTrigger>
              </Flex>

              <Stack gap={6}>
                <Stack gap={1}>
                  {/* <Text>Made by zuccha, © 2026</Text> */}
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
                  title="Playlists"
                  visual={
                    <DocsImage
                      alt="Playlist chips"
                      caption="Playlist chips let you switch between prepared sound sets"
                      maxW="20em"
                      src="/images/docs/playlist-chips.png"
                    />
                  }
                >
                  <Text>
                    A playlist is a prepared set of tracks for a place, mood, encounter, or
                    situation. Use playlists to switch between locations, scenes, or session beats.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Tracks"
                  visual={
                    <DocsImage
                      alt="Track controls"
                      caption="Each track has playback, mute, and volume controls"
                      maxW="20em"
                      src="/images/docs/track-controls.png"
                    />
                  }
                  visualPosition="left"
                >
                  <Text>
                    Tracks are audio files saved in this browser. They can be reused across
                    playlists, renamed, given icons, and assigned to ambience or environment.
                  </Text>
                </DocsSection>

                <Stack gap={1}>
                  <Text fontWeight="semibold">Ambience & Environment</Text>
                  <Text>
                    Ambience is for music or mood beds. Only one ambience track plays at a time, and
                    starting a new one fades out the previous one. Environment tracks are layered
                    sounds such as rain, wind, crowds, or fire, so multiple environment tracks can
                    play together.
                  </Text>
                </Stack>

                <DocsSection
                  title="Scenes"
                  visual={
                    <DocsImage
                      alt="Play Scene button"
                      caption="The scene control starts all tracks in the scene"
                      maxW="10em"
                      src="/images/docs/play-scene-button.png"
                    />
                  }
                >
                  <Text>
                    A playlist with only one ambience track is considered a scene. Scenes are not
                    meant for mixing sounds on the fly, rather all their tracks can be played at the
                    same time.
                  </Text>
                </DocsSection>

                <Stack gap={1}>
                  <Text fontWeight="semibold">Playback and Master Volume</Text>
                  <Text>
                    Individual tracks have their own play button, mute button, and volume. The
                    floating master control adjusts the whole mix and can pause or resume everything
                    currently playing.
                  </Text>
                </Stack>

                <DocsSection
                  title="Editing"
                  visual={
                    <DocsImage
                      alt="Edit and Done buttons"
                      caption="Edit opens playlist and track editing controls, Done hides them"
                      maxW="16em"
                      src="/images/docs/edit-button.png"
                    />
                  }
                  visualPosition="left"
                >
                  <Text>
                    Use Edit to change playlists and track lists, then Done to return to playback.
                    Track name, icon, audio file, and track type belong to the track itself. Volume
                    is playlist-specific, so the same track can be quieter in one playlist and
                    louder in another.
                  </Text>
                </DocsSection>

                <DocsSection
                  title="Deleting Tracks"
                  visual={
                    <DocsImage
                      alt="Tracks button"
                      caption="The Tracks button opens the library drawer"
                      maxW="10em"
                      src="/images/docs/tracks-button.png"
                    />
                  }
                >
                  <Text>
                    Open Tracks from the top bar to manage the track library. From there, tracks can
                    be searched, edited, or deleted from the device.
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
              </Stack>
            </Container>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
