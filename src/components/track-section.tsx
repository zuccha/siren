import { Box, Heading, Stack } from "@chakra-ui/react";

import type { LocalTrackInput } from "~/sound/local-tracks";
import type { Track } from "~/sound/tracks";

import TrackControl from "./track-control";
import TrackUpload from "./track-upload";

//------------------------------------------------------------------------------
// Track Section
//------------------------------------------------------------------------------

type TrackSectionProps = {
  defaultIcon: string;
  kind: Track["kind"];
  title: string;
  tracks: Track[];
  playingIds: Set<string>;
  volumes: Record<string, number>;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  onUpload: (input: LocalTrackInput) => Promise<void>;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackSection({
  defaultIcon,
  kind,
  title,
  tracks,
  playingIds,
  volumes,
  onRemove,
  onToggle,
  onUpload,
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
            onRemove={onRemove}
            onToggle={onToggle}
            onVolumeChange={onVolumeChange}
          />
        ))}
        <TrackUpload kind={kind} defaultIcon={defaultIcon} onUpload={onUpload} />
      </Stack>
    </Box>
  );
}
