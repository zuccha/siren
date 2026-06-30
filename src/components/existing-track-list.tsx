import { Button, Flex, Text } from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

import type { Track } from "~/sound/tracks";

//------------------------------------------------------------------------------
// Existing Track List
//------------------------------------------------------------------------------

type ExistingTrackListProps = {
  tracks: Track[];
  onAddTrack: (track: Track) => void;
};

export default function ExistingTrackList({ tracks, onAddTrack }: ExistingTrackListProps) {
  if (tracks.length === 0) return null;

  return (
    <Flex borderColor="border" borderWidth="1px" gap={2} p={2} rounded="sm" wrap="wrap">
      {tracks.map((track) => (
        <Button
          key={track.id}
          aria-label={`Add ${track.name}`}
          onClick={() => onAddTrack(track)}
          size="xs"
          variant="outline"
        >
          <PlusIcon size={14} />
          <DynamicIcon name={track.icon} size={14} />
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
  );
}
