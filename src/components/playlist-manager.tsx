import { Button, HStack } from "@chakra-ui/react";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";

import type { TrackPlaylist } from "~/sound/tracks";

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
            <HStack
              key={playlist.id}
              bg={isSelected ? "fg" : "transparent"}
              borderColor={isSelected ? "fg" : "border"}
              borderWidth="1px"
              color={isSelected ? "bg" : "fg"}
              gap={0}
              overflow="hidden"
              position="relative"
              pr={isEditing ? 1 : 0}
              rounded="full"
              flexShrink={0}
              _before={{
                bg: isSelected ? "whiteAlpha.300" : "bg.emphasized",
                content: '""',
                inset: 0,
                opacity: 0,
                pointerEvents: "none",
                position: "absolute",
                rounded: "inherit",
                transition: "opacity 120ms ease",
              }}
              _hover={{ _before: { opacity: 1 } }}
            >
              <Button
                borderEndRadius={isEditing ? 0 : "full"}
                borderStartRadius="full"
                color="inherit"
                onClick={() => onSelectPlaylist(playlist.id)}
                ps={3}
                pe={isEditing ? 1 : 3}
                size="xs"
                variant="plain"
                zIndex={1}
                _hover={{ bg: "transparent" }}
              >
                {isPlaying && <Volume2Icon size={13} />}
                {playlist.name}
              </Button>
              {isEditing && (
                <DeletePlaylistButton
                  disabled={false}
                  isSelected={isSelected}
                  playlist={playlist}
                  onRemovePlaylist={onRemovePlaylist}
                />
              )}
            </HStack>
          );
        })}
      </HStack>
      <HStack flexShrink={0} gap={2}>
        <Button
          disabled={sceneTrackCount === 0}
          onClick={onToggleScene}
          size="sm"
          variant="outline"
        >
          <SceneIcon size={16} />
          {isScenePlaying ? "Pause Scene" : "Play Scene"}
        </Button>
        {isEditing && (
          <EditPlaylistDialog playlist={selectedPlaylist} onEditPlaylist={onEditPlaylist} />
        )}
      </HStack>
    </HStack>
  );
}
