import {
  Badge,
  Box,
  Button,
  Drawer,
  Flex,
  HStack,
  Input,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LibraryIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";

import type { Track } from "~/sound/tracks";
import IconButton from "~/ui/icon-button";

import DeleteTrackDialog from "./delete-track-dialog";

//------------------------------------------------------------------------------
// Track Library Drawer
//------------------------------------------------------------------------------

type TrackLibraryDrawerProps = {
  tracks: Track[];
  onDeleteTrack: (track: Track) => Promise<void>;
};

export default function TrackLibraryDrawer({ tracks, onDeleteTrack }: TrackLibraryDrawerProps) {
  const [query, setQuery] = useState("");
  const [trackToDelete, setTrackToDelete] = useState<Track>();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTracks = (
    normalizedQuery
      ? tracks.filter((track) => track.name.toLowerCase().includes(normalizedQuery))
      : tracks
  ).toSorted((firstTrack, secondTrack) =>
    firstTrack.name.localeCompare(secondTrack.name, undefined, { sensitivity: "base" }),
  );

  //------------------------------------------------------------------------------
  // Delete Track
  //------------------------------------------------------------------------------

  const deleteTrack = async () => {
    if (!trackToDelete) return;

    await onDeleteTrack(trackToDelete);
    setTrackToDelete(undefined);
  };

  return (
    <>
      <Drawer.Root size="sm">
        <Drawer.Trigger asChild>
          <Button size="sm" variant="outline">
            <LibraryIcon size={16} />
            Tracks
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Tracks</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack gap={3}>
                  <Box position="relative">
                    <Box
                      alignItems="center"
                      color="fg.muted"
                      display="flex"
                      h="full"
                      left={2}
                      pointerEvents="none"
                      position="absolute"
                      top={0}
                    >
                      <SearchIcon size={14} />
                    </Box>
                    <Input
                      aria-label="Filter tracks"
                      onChange={(event) => setQuery(event.currentTarget.value)}
                      placeholder="Search tracks"
                      ps={7}
                      size="sm"
                      value={query}
                    />
                  </Box>

                  {tracks.length === 0 && (
                    <Text color="fg.muted" fontSize="sm">
                      No tracks in your library.
                    </Text>
                  )}

                  {tracks.length > 0 && filteredTracks.length === 0 && (
                    <Text color="fg.muted" fontSize="sm">
                      No tracks match.
                    </Text>
                  )}

                  {filteredTracks.length > 0 && (
                    <Stack gap={2}>
                      {filteredTracks.map((track) => (
                        <Flex
                          key={track.id}
                          align="center"
                          borderColor="border"
                          borderWidth="1px"
                          gap={3}
                          minW={0}
                          px={3}
                          py={2}
                          rounded="sm"
                        >
                          <Flex align="center" color="fg.muted" h={8} justify="center" w={8}>
                            <DynamicIcon name={track.icon} size={18} />
                          </Flex>
                          <Box flex={1} minW={0}>
                            <HStack gap={2} minW={0}>
                              <Text fontSize="sm" fontWeight="medium" truncate>
                                {track.name}
                              </Text>
                              <Badge flexShrink={0} size="sm" variant="subtle">
                                {track.kind}
                              </Badge>
                            </HStack>
                          </Box>
                          <IconButton
                            Icon={Trash2Icon}
                            aria-label={`Delete ${track.name}`}
                            onClick={() => setTrackToDelete(track)}
                            size="xs"
                            variant="ghost"
                          />
                        </Flex>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <DeleteTrackDialog
        track={trackToDelete}
        onCancel={() => setTrackToDelete(undefined)}
        onDelete={deleteTrack}
      />
    </>
  );
}
