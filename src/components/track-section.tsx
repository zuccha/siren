import { Box, Heading, Stack } from "@chakra-ui/react";

import type { Track } from "~/sound/tracks";

import TrackControl from "./track-control";

//------------------------------------------------------------------------------
// Track Section
//------------------------------------------------------------------------------

type TrackSectionProps = {
  title: string;
  tracks: Track[];
  playingIds: Set<string>;
  volumes: Record<string, number>;
  onToggle: (track: Track) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackSection({
  title,
  tracks,
  playingIds,
  volumes,
  onToggle,
  onVolumeChange,
}: TrackSectionProps) {
  return (
    <Box as="section">
      <Heading as="h2" size="md" mb={3}>
        {title}
      </Heading>
      <Stack gap={2}>
        {tracks.map((track) => (
          <TrackControl
            key={track.id}
            track={track}
            isPlaying={playingIds.has(track.id)}
            volume={volumes[track.id] ?? track.initialVolume}
            onToggle={onToggle}
            onVolumeChange={onVolumeChange}
          />
        ))}
      </Stack>
    </Box>
  );
}
