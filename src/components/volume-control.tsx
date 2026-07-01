import { HStack, Text, type StackProps } from "@chakra-ui/react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";

import type { Track } from "~/sound/tracks";
import IconButton from "~/ui/icon-button";
import VolumeSlider from "~/ui/volume-slider";

//------------------------------------------------------------------------------
// Volume Control
//------------------------------------------------------------------------------

type VolumeControlProps = {
  gridColumn?: StackProps["gridColumn"];
  isMuted: boolean;
  track: Track;
  volume: number;
  onMuteToggle: (trackId: string) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function VolumeControl({
  gridColumn,
  isMuted,
  track,
  volume,
  onMuteToggle,
  onVolumeChange,
}: VolumeControlProps) {
  const VolumeIcon = isMuted ? VolumeXIcon : Volume2Icon;

  return (
    <HStack gap={2} gridColumn={gridColumn} minW={0}>
      <IconButton
        Icon={VolumeIcon}
        aria-label={`${isMuted ? "Unmute" : "Mute"} ${track.name}`}
        color={isMuted ? "fg" : "fg.muted"}
        minH={6}
        minW={6}
        onClick={() => onMuteToggle(track.id)}
        size="2xs"
        variant="ghost"
      />
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
