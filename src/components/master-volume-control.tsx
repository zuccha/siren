import { HStack, Text } from "@chakra-ui/react";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";

import IconButton from "~/ui/icon-button";
import VolumeSlider from "~/ui/volume-slider";

//------------------------------------------------------------------------------
// Master Volume Control
//------------------------------------------------------------------------------

type MasterVolumeControlProps = {
  hasActiveTracks: boolean;
  isMuted: boolean;
  isPaused: boolean;
  volume: number;
  onMuteToggle: () => void;
  onPauseToggle: () => void;
  onVolumeChange: (volume: number) => void;
};

export default function MasterVolumeControl({
  hasActiveTracks,
  isMuted,
  isPaused,
  volume,
  onMuteToggle,
  onPauseToggle,
  onVolumeChange,
}: MasterVolumeControlProps) {
  const VolumeIcon = isMuted ? VolumeXIcon : Volume2Icon;

  return (
    <HStack
      bg="bg.panel"
      borderColor="border"
      borderWidth="1px"
      bottom={4}
      boxShadow="lg"
      gap={3}
      left="50%"
      maxW="calc(100vw - 2rem)"
      minW={{ base: "min(22rem, calc(100vw - 2rem))", sm: "22rem" }}
      px={3}
      py={2}
      position="fixed"
      rounded="md"
      transform="translateX(-50%)"
      zIndex="overlay"
    >
      <IconButton
        Icon={isPaused ? PlayIcon : PauseIcon}
        aria-label={isPaused ? "Resume all tracks" : "Pause all tracks"}
        disabled={!hasActiveTracks}
        onClick={onPauseToggle}
        size="sm"
        variant="outline"
      />
      <IconButton
        Icon={VolumeIcon}
        aria-label={isMuted ? "Unmute master volume" : "Mute master volume"}
        color={isMuted ? "fg" : "fg.muted"}
        onClick={onMuteToggle}
        size="sm"
        variant="ghost"
      />
      <VolumeSlider
        aria-label="Master volume"
        minW={0}
        value={volume}
        onValueChange={onVolumeChange}
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
