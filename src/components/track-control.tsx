import { Box, Button, Flex, Grid, Heading } from "@chakra-ui/react";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

import type { Track } from "~/sound/tracks";
import IconButton from "~/ui/icon-button";

import VolumeControl from "./volume-control";

//------------------------------------------------------------------------------
// Track Control
//------------------------------------------------------------------------------

type TrackControlProps = {
  track: Track;
  isPlaying: boolean;
  volume: number;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackControl({
  track,
  isPlaying,
  volume,
  onRemove,
  onToggle,
  onVolumeChange,
}: TrackControlProps) {
  const PlayStateIcon = isPlaying ? PauseIcon : PlayIcon;

  return (
    <Box
      bg="bg.panel"
      borderColor={isPlaying ? "fg" : "border"}
      borderWidth="1px"
      position="relative"
      px={3}
      py={2}
      rounded="sm"
    >
      <IconButton
        Icon={XIcon}
        aria-label={`Delete ${track.name}`}
        colorPalette="red"
        minH={6}
        minW={6}
        onClick={() => onRemove(track)}
        position="absolute"
        right={0}
        size="2xs"
        top={0}
        transform="translate(50%, -50%)"
        variant="solid"
        zIndex={1}
      />

      <Grid
        alignItems="center"
        gap={3}
        templateColumns="auto minmax(7rem, 1fr) minmax(9rem, 14rem) auto"
      >
        <Flex align="center" color="fg.muted" h={8} justify="center" shrink={0} w={8}>
          <DynamicIcon name={track.icon} size={18} />
        </Flex>

        <Heading minW={0} size="sm">
          {track.name}
        </Heading>

        <VolumeControl track={track} volume={volume} onVolumeChange={onVolumeChange} />

        <Button
          aria-label={`${isPlaying ? "Stop" : "Play"} ${track.name}`}
          minW="4.5rem"
          onClick={() => onToggle(track)}
          size="xs"
          variant={isPlaying ? "solid" : "outline"}
        >
          <PlayStateIcon size={14} />
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </Grid>
    </Box>
  );
}
