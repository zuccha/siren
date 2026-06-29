import { HStack, Text } from "@chakra-ui/react";
import { Volume2Icon } from "lucide-react";

import type { Track } from "~/sound/tracks";

//------------------------------------------------------------------------------
// Volume Control
//------------------------------------------------------------------------------

type VolumeControlProps = {
  display: { base: string; md: string };
  gridColumn?: string;
  track: Track;
  volume: number;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function VolumeControl({
  display,
  gridColumn,
  track,
  volume,
  onVolumeChange,
}: VolumeControlProps) {
  return (
    <HStack display={display} gap={2} gridColumn={gridColumn}>
      <Volume2Icon size={15} />
      <input
        aria-label={`${track.name} volume`}
        max={100}
        min={0}
        onChange={(event) => onVolumeChange(track.id, event.currentTarget.valueAsNumber)}
        style={{
          accentColor: "currentColor",
          flex: 1,
        }}
        type="range"
        value={volume}
      />
      <Text
        color="fg.muted"
        fontSize="xs"
        fontVariantNumeric="tabular-nums"
        minW="3ch"
        textAlign="right"
      >
        {volume}
      </Text>
    </HStack>
  );
}
