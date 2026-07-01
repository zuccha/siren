import { Button, HStack, Icon } from "@chakra-ui/react";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";

import type { TrackPlaylist } from "~/sound/tracks";
import { getButtonIconStyles } from "~/ui/button-icon-styles";

import AddPlaylistDialog from "./add-playlist-dialog";
import DeletePlaylistButton from "./delete-playlist-button";
import EditPlaylistDialog from "./edit-playlist-dialog";

//------------------------------------------------------------------------------
// Playlist Manager
//------------------------------------------------------------------------------

type PlaylistManagerProps = {
  isEditing: boolean;
  isScenePlaying: boolean;
  playingPlaylistId: string | undefined;
  playlists: TrackPlaylist[];
  sceneTrackCount: number;
  selectedPlaylistId: string | undefined;
  onAddPlaylist: (name: string) => void;
  onEditPlaylist: (playlistId: string, name: string) => void;
  onRemovePlaylist: (playlistId: string) => void;
  onToggleScene: () => void;
  onSelectPlaylist: (playlistId: string) => void;
};

export default function PlaylistManager({
  isEditing,
  isScenePlaying,
  playingPlaylistId,
  playlists,
  sceneTrackCount,
  selectedPlaylistId,
  onAddPlaylist,
  onEditPlaylist,
  onRemovePlaylist,
  onToggleScene,
  onSelectPlaylist,
}: PlaylistManagerProps) {
  const selectedPlaylist = playlists.find((playlist) => playlist.id === selectedPlaylistId);
  const SceneIcon = isScenePlaying ? PauseIcon : PlayIcon;

  return (
    <HStack align="start" gap={3} justify="space-between" minW={0}>
      <HStack flex={1} gap={2} minW={0} overflowX="auto">
        <AddPlaylistDialog onAddPlaylist={onAddPlaylist} />

        {playlists.map((playlist) => {
          const isSelected = playlist.id === selectedPlaylistId;
          const isPlaying = playlist.id === playingPlaylistId;

          return (
            <Button
              borderRadius="full"
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist.id)}
              size="xs"
              variant={isSelected ? "solid" : "outline"}
              zIndex={1}
              _icon={getButtonIconStyles("xs")}
            >
              {isPlaying && <Volume2Icon />}
              {playlist.name}
            </Button>
          );
        })}
      </HStack>
      <HStack flexShrink={0} gap={2}>
        <Button
          disabled={sceneTrackCount === 0}
          onClick={onToggleScene}
          size="xs"
          variant="outline"
          _icon={getButtonIconStyles("xs")}
        >
          <Icon size="xs">
            <SceneIcon />
          </Icon>
          {isScenePlaying ? "Pause Scene" : "Play Scene"}
        </Button>
        {isEditing && selectedPlaylist && (
          <>
            <EditPlaylistDialog playlist={selectedPlaylist} onEditPlaylist={onEditPlaylist} />
            <DeletePlaylistButton
              disabled={false}
              playlist={selectedPlaylist}
              onRemovePlaylist={onRemovePlaylist}
            />
          </>
        )}
      </HStack>
    </HStack>
  );
}
