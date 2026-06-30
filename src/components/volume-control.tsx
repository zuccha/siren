import { HStack, Text } from "@chakra-ui/react";
import { Volume2Icon } from "lucide-react";

import type { Track } from "~/sound/tracks";
import VolumeSlider from "~/ui/volume-slider";

//------------------------------------------------------------------------------
// Volume Control
//------------------------------------------------------------------------------

type VolumeControlProps = {
  gridColumn?: string;
  track: Track;
  volume: number;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function VolumeControl({
  gridColumn,
  track,
  volume,
  onVolumeChange,
}: VolumeControlProps) {
  return (
    <HStack gap={2} gridColumn={gridColumn}>
      <Volume2Icon size={15} />
      <VolumeSlider
        aria-label={`${track.name} volume`}
        value={volume}
        onValueChange={(nextVolume) => onVolumeChange(track.id, nextVolume)}
      />
      <Text
        color="fg.muted"
        fontSize="xs"
        fontVariantNumeric="tabular-nums"
        minW="2ch"
        textAlign="right"
      >
        {volume}
      </Text>
    </HStack>
  );
}
