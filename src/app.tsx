import { Box, Container, Flex, Grid, HStack, Heading } from "@chakra-ui/react";
import { useState } from "react";

import TrackSection from "~/components/track-section";
import useTrackMixer from "~/hooks/use-track-mixer";
import ThemeButton from "~/theme/theme-button";
import EditModeSwitch from "~/ui/edit-mode-switch";

//------------------------------------------------------------------------------
// App
//------------------------------------------------------------------------------

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const mixer = useTrackMixer();

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

        {mixer.isLoaded && (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
            <TrackSection
              defaultIcon="music"
              kind="ambience"
              title="Ambience / Music"
              tracks={mixer.trackLibrary.ambienceTracks}
              isEditing={isEditing}
              playingIds={mixer.playingIds}
              volumes={mixer.volumes}
              onEdit={mixer.editTrack}
              onRemove={mixer.removeTrack}
              onReorder={mixer.reorderTracks}
              onToggle={mixer.toggleTrack}
              onUpload={mixer.addLocalTrack}
              onVolumeChange={mixer.setTrackVolume}
            />
            <TrackSection
              defaultIcon="wind"
              kind="environment"
              title="Environment"
              tracks={mixer.trackLibrary.environmentTracks}
              isEditing={isEditing}
              playingIds={mixer.playingIds}
              volumes={mixer.volumes}
              onEdit={mixer.editTrack}
              onRemove={mixer.removeTrack}
              onReorder={mixer.reorderTracks}
              onToggle={mixer.toggleTrack}
              onUpload={mixer.addLocalTrack}
              onVolumeChange={mixer.setTrackVolume}
            />
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;
