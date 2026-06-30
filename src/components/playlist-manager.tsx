import { Box, Button, HStack } from "@chakra-ui/react";

import type { TrackPlaylist } from "~/sound/tracks";

import AddPlaylistDialog from "./add-playlist-dialog";
import DeletePlaylistButton from "./delete-playlist-button";

//------------------------------------------------------------------------------
// Playlist Manager
//------------------------------------------------------------------------------

type PlaylistManagerProps = {
  isEditing: boolean;
  playlists: TrackPlaylist[];
  selectedPlaylistId: string | undefined;
  onAddPlaylist: (name: string) => void;
  onRemovePlaylist: (playlistId: string) => void;
  onSelectPlaylist: (playlistId: string) => void;
};

export default function PlaylistManager({
  isEditing,
  playlists,
  selectedPlaylistId,
  onAddPlaylist,
  onRemovePlaylist,
  onSelectPlaylist,
}: PlaylistManagerProps) {
  return (
    <HStack align="start" gap={3} justify="space-between" minW={0}>
      <HStack flex={1} gap={2} minW={0} overflowX="auto">
        {playlists.map((playlist) => {
          const isSelected = playlist.id === selectedPlaylistId;

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
                h={7}
                onClick={() => onSelectPlaylist(playlist.id)}
                ps={3}
                pe={isEditing ? 1 : 3}
                size="xs"
                variant="plain"
                zIndex={1}
                _hover={{ bg: "transparent" }}
              >
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
      <Box flexShrink={0}>
        <AddPlaylistDialog onAddPlaylist={onAddPlaylist} />
      </Box>
    </HStack>
  );
}
