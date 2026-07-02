import { Box, Container, Flex, Grid, Heading, HStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import AboutPage from "~/components/about-page";
import EmptyPlaylistState from "~/components/empty-playlist-state";
import MasterVolumeControl from "~/components/master-volume-control";
import PlaylistManager from "~/components/playlist-manager";
import TopbarActions from "~/components/topbar-actions";
import TrackSection from "~/components/track-section";
import { useEditMode } from "~/edit-mode";
import useGlobalHotkeys from "~/hooks/use-global-hotkeys";
import useTrackMixer from "~/hooks/use-track-mixer";
import type { Track, TrackKind } from "~/sound/tracks";

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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTrackLibraryOpen, setIsTrackLibraryOpen] = useState(false);
  const mixer = useTrackMixer();

  //------------------------------------------------------------------------------
  // Toggle Track Library
  //------------------------------------------------------------------------------

  const toggleTrackLibrary = useCallback(() => {
    setIsTrackLibraryOpen((current) => !current);
  }, []);

  return (
    <Box minH="100vh" bg="bg" color="fg">
      <AppHotkeys
        onMasterMuteToggle={mixer.toggleMasterMute}
        onPauseToggle={mixer.togglePauseAll}
        onSceneToggle={mixer.toggleScene}
        onTracksToggle={toggleTrackLibrary}
      />
      <Container maxW="7xl" px={{ base: 4, md: 8 }} pt={{ base: 5, md: 8 }} pb={28}>
        <Flex align="center" justify="space-between" gap={4} mb={{ base: 2, md: 4 }}>
          <Heading
            as="h1"
            fontFamily="Nautilus"
            fontWeight="normal"
            letterSpacing={0}
            lineHeight={1}
            size={{ base: "3xl", md: "4xl" }}
          >
            SirenSong
          </Heading>
          <HStack gap={{ base: 1, sm: 3 }}>
            <TopbarActions
              isTrackLibraryOpen={isTrackLibraryOpen}
              tracks={mixer.tracks}
              onAddTrack={mixer.addLibraryTrack}
              onDeleteTrack={mixer.deleteTrack}
              onEditTrack={mixer.editTrack}
              onImportPreset={mixer.importPreset}
              onInfoOpen={() => setIsAboutOpen(true)}
              onTrackLibraryOpenChange={setIsTrackLibraryOpen}
            />
          </HStack>
        </Flex>

        {mixer.isLoaded && mixer.playlists.length === 0 && (
          <EmptyPlaylistState
            onAddPlaylist={mixer.addPlaylist}
            onImportPreset={mixer.importPreset}
          />
        )}

        {mixer.isLoaded && mixer.playlists.length > 0 && (
          <Grid gap={{ base: 5, md: 6 }}>
            <PlaylistManager
              isScenePlaying={mixer.isScenePlaying}
              playingPlaylistId={mixer.playingPlaylistId}
              playlists={mixer.playlists}
              sceneTrackCount={mixer.sceneTrackCount}
              selectedPlaylistId={mixer.selectedPlaylistId}
              onAddPlaylist={mixer.addPlaylist}
              onEditPlaylist={mixer.editPlaylist}
              onRemovePlaylist={mixer.removePlaylist}
              onSelectPlaylist={mixer.setSelectedPlaylistId}
              onToggleScene={mixer.toggleScene}
            />
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }}>
              <TrackSection
                defaultIcon="music"
                kind="ambience"
                title="Ambience"
                availableTracks={getAvailableTracks(
                  mixer.tracks,
                  mixer.trackLibrary.ambienceTracks,
                  "ambience",
                )}
                tracks={mixer.trackLibrary.ambienceTracks}
                mutedTrackIds={mixer.mutedTrackIds}
                playingIds={mixer.playingIds}
                volumes={mixer.volumes}
                onAddTrack={mixer.addTrackToPlaylist}
                onEdit={mixer.editTrack}
                onMuteToggle={mixer.toggleTrackMute}
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
                isPlayingAll={mixer.isEnvironmentPlaying}
                mutedTrackIds={mixer.mutedTrackIds}
                playingIds={mixer.playingIds}
                volumes={mixer.volumes}
                onAddTrack={mixer.addTrackToPlaylist}
                onEdit={mixer.editTrack}
                onMuteToggle={mixer.toggleTrackMute}
                onRemove={mixer.removeTrackFromPlaylist}
                onReorder={mixer.reorderTracks}
                onToggle={mixer.toggleTrack}
                onToggleAll={mixer.toggleEnvironmentTracks}
                onUpload={mixer.addLocalTrack}
                onVolumeChange={mixer.setTrackVolume}
              />
            </Grid>
          </Grid>
        )}
      </Container>
      {mixer.isLoaded && mixer.playlists.length > 0 && (
        <MasterVolumeControl
          hasActiveTracks={mixer.hasActiveTracks}
          isMuted={mixer.isMasterMuted}
          isPaused={mixer.isPaused}
          volume={mixer.masterVolume}
          onMuteToggle={mixer.toggleMasterMute}
          onPauseToggle={mixer.togglePauseAll}
          onVolumeChange={mixer.setMasterVolume}
        />
      )}
      {isAboutOpen && <AboutPage onClose={() => setIsAboutOpen(false)} />}
    </Box>
  );
}

//------------------------------------------------------------------------------
// App Hotkeys
//------------------------------------------------------------------------------

type AppHotkeysProps = {
  onMasterMuteToggle: () => void;
  onPauseToggle: () => void;
  onSceneToggle: () => void;
  onTracksToggle: () => void;
};

function AppHotkeys({
  onMasterMuteToggle,
  onPauseToggle,
  onSceneToggle,
  onTracksToggle,
}: AppHotkeysProps) {
  const { toggleEditMode } = useEditMode();

  useGlobalHotkeys({
    onEditToggle: toggleEditMode,
    onMasterMuteToggle,
    onPauseToggle,
    onSceneToggle,
    onTracksToggle,
  });

  return null;
}

export default App;
