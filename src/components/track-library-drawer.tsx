import { Box, Drawer, Flex, HStack, Input, Portal, Stack, Text } from "@chakra-ui/react";
import { LibraryIcon, PencilIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import type { LocalTrackInput, LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track, TrackKind } from "~/sound/tracks";
import Button from "~/ui/button";
import IconButton from "~/ui/icon-button";

import DeleteTrackDialog from "./delete-track-dialog";
import EditTrackDialog from "./edit-track-dialog";
import TrackStatusIcon from "./track-status-icon";
import TrackUpload from "./track-upload";

//------------------------------------------------------------------------------
// Track Library Drawer
//------------------------------------------------------------------------------

type TrackLibraryDrawerProps = {
  tracks: Track[];
  onAddTrack: (input: LocalTrackInput) => Promise<void>;
  onDeleteTrack: (track: Track) => Promise<void>;
  onEditTrack: (track: Track, input: LocalTrackUpdateInput) => Promise<void>;
};

export default function TrackLibraryDrawer({
  tracks,
  onAddTrack,
  onDeleteTrack,
  onEditTrack,
}: TrackLibraryDrawerProps) {
  const [query, setQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<TrackKind>("ambience");
  const [trackToEdit, setTrackToEdit] = useState<Track>();
  const [trackToDelete, setTrackToDelete] = useState<Track>();
  const normalizedQuery = query.trim().toLowerCase();
  const kindTracks = tracks.filter((track) => track.kind === selectedKind);
  const filteredTracks = (
    normalizedQuery
      ? kindTracks.filter((track) => track.name.toLowerCase().includes(normalizedQuery))
      : kindTracks
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

  //------------------------------------------------------------------------------
  // Select New Track Kind
  //------------------------------------------------------------------------------

  const selectNewTrackKind = (kind: TrackKind) => {
    setSelectedKind(kind);
  };

  return (
    <>
      <Drawer.Root size="sm">
        <Drawer.Trigger asChild>
          <Button size="sm" variant="outline">
            <LibraryIcon />
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
                <Stack gap={5}>
                  <HStack gap={2}>
                    <Button
                      flex={1}
                      onClick={() => selectNewTrackKind("ambience")}
                      size="xs"
                      variant={selectedKind === "ambience" ? "solid" : "outline"}
                    >
                      Ambience
                    </Button>
                    <Button
                      flex={1}
                      onClick={() => selectNewTrackKind("environment")}
                      size="xs"
                      variant={selectedKind === "environment" ? "solid" : "outline"}
                    >
                      Environment
                    </Button>
                  </HStack>

                  <TrackUpload
                    key={selectedKind}
                    defaultIcon={getDefaultTrackIcon(selectedKind)}
                    kind={selectedKind}
                    onUpload={onAddTrack}
                  />

                  <Stack>
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

                    {tracks.length > 0 && kindTracks.length === 0 && (
                      <Text color="fg.muted" fontSize="sm">
                        No {getTrackKindLabel(selectedKind).toLowerCase()} tracks in your library.
                      </Text>
                    )}

                    {kindTracks.length > 0 && filteredTracks.length === 0 && (
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
                            bg={track.hasMissingAudio ? "bg.error" : undefined}
                            borderColor="border"
                            borderWidth="1px"
                            gap={3}
                            minW={0}
                            px={3}
                            py={2}
                            rounded="sm"
                          >
                            <Flex align="center" color="fg.muted" h={8} justify="center" w={8}>
                              <TrackStatusIcon track={track} size={18} />
                            </Flex>
                            <Box flex={1} minW={0}>
                              <Stack gap={0.5} minW={0}>
                                <Text fontSize="sm" fontWeight="medium" truncate>
                                  {track.name}
                                </Text>
                                <Text color="fg.muted" fontSize="xs" truncate>
                                  {track.fileName}
                                </Text>
                              </Stack>
                            </Box>
                            <HStack gap={0}>
                              <IconButton
                                Icon={PencilIcon}
                                aria-label={`Edit ${track.name}`}
                                onClick={() => setTrackToEdit(track)}
                                size="xs"
                                variant="ghost"
                              />
                              <IconButton
                                Icon={Trash2Icon}
                                aria-label={`Delete ${track.name}`}
                                onClick={() => setTrackToDelete(track)}
                                size="xs"
                                variant="ghost"
                              />
                            </HStack>
                          </Flex>
                        ))}
                      </Stack>
                    )}
                  </Stack>
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
      <EditTrackDialog
        track={trackToEdit}
        onCancel={() => setTrackToEdit(undefined)}
        onEditTrack={onEditTrack}
      />
    </>
  );
}

//------------------------------------------------------------------------------
// Get Default Track Icon
//------------------------------------------------------------------------------

function getDefaultTrackIcon(kind: TrackKind) {
  return kind === "ambience" ? "music" : "wind";
}

//------------------------------------------------------------------------------
// Get Track Kind Label
//------------------------------------------------------------------------------

function getTrackKindLabel(kind: TrackKind) {
  return kind === "ambience" ? "Ambience" : "Environment";
}
