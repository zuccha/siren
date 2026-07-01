import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";

import type { Track } from "~/sound/tracks";
import Button from "~/ui/button";
import Input from "~/ui/input";

//------------------------------------------------------------------------------
// Existing Track List
//------------------------------------------------------------------------------

type ExistingTrackListProps = {
  tracks: Track[];
  onAddTrack: (track: Track) => void;
};

export default function ExistingTrackList({ tracks, onAddTrack }: ExistingTrackListProps) {
  const [query, setQuery] = useState("");

  if (tracks.length === 0) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTracks = (
    normalizedQuery
      ? tracks.filter((track) => track.name.toLowerCase().includes(normalizedQuery))
      : tracks
  ).toSorted((firstTrack, secondTrack) =>
    firstTrack.name.localeCompare(secondTrack.name, undefined, { sensitivity: "base" }),
  );

  return (
    <Box borderWidth="1px" px={3} py={2} rounded="sm">
      <Stack gap={2}>
        <Box position="relative">
          <Box
            alignItems="center"
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
            aria-label="Filter existing tracks"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search existing tracks"
            ps={7}
            size="xs"
            value={query}
          />
        </Box>

        {filteredTracks.length > 0 ? (
          <Flex gap={2} wrap="wrap">
            {filteredTracks.map((track) => (
              <Button
                key={track.id}
                aria-label={`Add ${track.name}`}
                onClick={() => onAddTrack(track)}
                size="xs"
                variant="outline"
              >
                <PlusIcon />
                <DynamicIcon name={track.icon} />
                <Text
                  as="span"
                  maxW="10rem"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {track.name}
                </Text>
              </Button>
            ))}
          </Flex>
        ) : (
          <Text color="gray.500" fontSize="sm">
            No existing tracks match.
          </Text>
        )}
      </Stack>
    </Box>
  );
}
