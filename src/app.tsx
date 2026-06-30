import { Box, Container, Flex, Grid, HStack, Heading } from "@chakra-ui/react";
import { useState } from "react";

import PlaylistManager from "~/components/playlist-manager";
import TrackSection from "~/components/track-section";
import useTrackMixer from "~/hooks/use-track-mixer";
import type { Track, TrackKind } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";
import EditModeSwitch from "~/ui/edit-mode-switch";

//------------------------------------------------------------------------------
// Get Available Tracks
//------------------------------------------------------------------------------

function getAvailableTracks(tracks: Track[], playlistTracks: Track[], kind: TrackKind) {
  const playlistTrackIds = new Set(playlistTracks.map((track) => track.id));

  return tracks.filter((track) => track.kind === kind && !playlistTrackIds.has(track.id));
}

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
          <Grid gap={{ base: 5, md: 6 }}>
            <PlaylistManager
              isEditing={isEditing}
              playlists={mixer.playlists}
              selectedPlaylistId={mixer.selectedPlaylistId}
              onAddPlaylist={mixer.addPlaylist}
              onRemovePlaylist={mixer.removePlaylist}
              onSelectPlaylist={mixer.setSelectedPlaylistId}
            />
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
              <TrackSection
                defaultIcon="music"
                kind="ambience"
                title="Ambience / Music"
                availableTracks={getAvailableTracks(
                  mixer.tracks,
                  mixer.trackLibrary.ambienceTracks,
                  "ambience",
                )}
                tracks={mixer.trackLibrary.ambienceTracks}
                isEditing={isEditing}
                playingIds={mixer.playingIds}
                volumes={mixer.volumes}
                onAddTrack={mixer.addTrackToPlaylist}
                onEdit={mixer.editTrack}
                onRemove={mixer.removeTrackFromPlaylist}
                onReorder={mixer.reorderTracks}
                onToggle={mixer.toggleTrack}
                onUpload={mixer.addLocalTrack}
                onVolumeChange={mixer.setTrackVolume}
              />
              <TrackSection
                defaultIcon="wind"
                kind="environment"
                title="Environment"
                availableTracks={getAvailableTracks(
                  mixer.tracks,
                  mixer.trackLibrary.environmentTracks,
                  "environment",
                )}
                tracks={mixer.trackLibrary.environmentTracks}
                isEditing={isEditing}
                playingIds={mixer.playingIds}
                volumes={mixer.volumes}
                onAddTrack={mixer.addTrackToPlaylist}
                onEdit={mixer.editTrack}
                onRemove={mixer.removeTrackFromPlaylist}
                onReorder={mixer.reorderTracks}
                onToggle={mixer.toggleTrack}
                onUpload={mixer.addLocalTrack}
                onVolumeChange={mixer.setTrackVolume}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;
