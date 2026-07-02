import { HStack, Icon, Menu, Portal, Span, Text } from "@chakra-ui/react";
import { CheckIcon, ChevronDownIcon, PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";

import { useEditMode } from "~/edit-mode";
import type { TrackPlaylist } from "~/sound/tracks";
import Button from "~/ui/button";

import AddPlaylistDialog from "./add-playlist-dialog";
import DeletePlaylistButton from "./delete-playlist-button";
import EditPlaylistDialog from "./edit-playlist-dialog";

//------------------------------------------------------------------------------
// Playlist Manager
//------------------------------------------------------------------------------

type PlaylistManagerProps = {
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
  const { isEditing } = useEditMode();
  const selectedPlaylist = playlists.find((playlist) => playlist.id === selectedPlaylistId);
  const SceneIcon = isScenePlaying ? PauseIcon : PlayIcon;

  return (
    <HStack align="start" gap={2} justify={{ base: "flex-end", md: "space-between" }} wrap="wrap">
      <HStack display={{ base: "flex", md: "none" }} flex={1} gap={{ base: 2, md: 3 }}>
        <AddPlaylistDialog onAddPlaylist={onAddPlaylist} />

        <Menu.Root positioning={{ sameWidth: true }}>
          <Menu.Trigger asChild>
            <Button
              justifyContent="space-between"
              flex={1}
              minW="6rem"
              maxW="16rem"
              size="xs"
              variant="outline"
            >
              <Span flex={1} textAlign="left" truncate>
                {selectedPlaylist?.name ?? "Select playlist"}
              </Span>
              {selectedPlaylist?.id === playingPlaylistId && <Volume2Icon />}
              <ChevronDownIcon />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {playlists.map((playlist) => {
                  const isSelected = playlist.id === selectedPlaylistId;
                  const isPlaying = playlist.id === playingPlaylistId;

                  return (
                    <Menu.Item
                      key={playlist.id}
                      value={playlist.id}
                      onClick={() => onSelectPlaylist(playlist.id)}
                    >
                      <HStack gap={2} w="full">
                        <Text as="span" flex={1} truncate>
                          {playlist.name}
                        </Text>
                        {isPlaying && (
                          <Icon size="xs">
                            <Volume2Icon />
                          </Icon>
                        )}
                        {isSelected && (
                          <Icon size="xs">
                            <CheckIcon />
                          </Icon>
                        )}
                      </HStack>
                    </Menu.Item>
                  );
                })}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <HStack display={{ base: "none", md: "flex" }} flex={1} gap={2} m={-1} overflowX="auto" p={1}>
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
        >
          <SceneIcon />
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
