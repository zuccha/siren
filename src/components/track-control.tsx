import { Box, Flex, Grid, Heading, Input } from "@chakra-ui/react";
import { GripVerticalIcon, PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";

import type { LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track } from "~/sound/tracks";
import Button from "~/ui/button";
import IconButton from "~/ui/icon-button";

import TrackIconPicker from "./track-icon-picker";
import TrackStatusIcon from "./track-status-icon";
import VolumeControl from "./volume-control";

//------------------------------------------------------------------------------
// Track Control
//------------------------------------------------------------------------------

type TrackControlProps = {
  track: Track;
  isEditing: boolean;
  isDragging: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  volume: number;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent) => void;
  onDragStart: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
  onEdit: (track: Track, input: LocalTrackUpdateInput) => void;
  onMuteToggle: (trackId: string) => void;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackControl({
  track,
  isEditing,
  isDragging,
  isMuted,
  isPlaying,
  volume,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onEdit,
  onMuteToggle,
  onRemove,
  onToggle,
  onVolumeChange,
}: TrackControlProps) {
  const PlayStateIcon = isPlaying ? PauseIcon : PlayIcon;
  const [draftName, setDraftName] = useState(track.name);
  const [draftIcon, setDraftIcon] = useState<string>(track.icon);

  useEffect(() => {
    setDraftName(track.name);
    setDraftIcon(track.icon);
  }, [track.icon, track.name]);

  //------------------------------------------------------------------------------
  // Commit Track Edits
  //------------------------------------------------------------------------------

  const commitTrackEdits = () => {
    onEdit(track, {
      name: draftName,
      icon: draftIcon,
      initialVolume: track.initialVolume,
    });
  };

  //------------------------------------------------------------------------------
  // Edit Track Volume
  //------------------------------------------------------------------------------

  const editTrackVolume = (trackId: string, nextVolume: number) => {
    onVolumeChange(trackId, nextVolume);
  };

  //------------------------------------------------------------------------------
  // Edit Track Icon
  //------------------------------------------------------------------------------

  const editTrackIcon = (icon: string) => {
    setDraftIcon(icon);
    onEdit(track, {
      name: draftName,
      icon,
      initialVolume: track.initialVolume,
    });
  };

  return (
    <Box
      bg={track.hasMissingAudio ? "bg.error" : "bg.panel"}
      borderColor={isPlaying ? "fg" : "border"}
      borderWidth="1px"
      onDragOver={onDragOver}
      onDrop={onDrop}
      opacity={isDragging ? 0.55 : 1}
      position="relative"
      px={3}
      py={2}
      rounded="sm"
    >
      {isEditing && (
        <IconButton
          Icon={XIcon}
          aria-label={`Delete ${track.name}`}
          minH={6}
          minW={6}
          onClick={() => onRemove(track)}
          position="absolute"
          right={0}
          size="2xs"
          top={0}
          transform="translate(50%, -30%)"
          variant="solid"
          zIndex={1}
        />
      )}

      <Grid
        alignItems="center"
        gap={2}
        templateColumns={{
          base: "auto minmax(0, 1fr) auto",
          sm: "auto minmax(0, 1fr) minmax(9rem, 14rem) auto",
        }}
      >
        {isEditing ? (
          <Button
            aria-label={`Drag ${track.name}`}
            color="fg.muted"
            cursor="grab"
            draggable
            mx={-2}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            p={0}
            size="xs"
            variant="plain"
            _active={{ cursor: "grabbing" }}
          >
            <GripVerticalIcon />
          </Button>
        ) : (
          <Flex align="center" color="fg.muted" h={8} justify="center" shrink={0} w={8}>
            <TrackStatusIcon track={track} size={18} />
          </Flex>
        )}

        {isEditing ? (
          <Grid gap={2} minW={0} templateColumns="auto minmax(0, 1fr)">
            <TrackIconPicker
              label={`${track.name} icon`}
              size="xs"
              value={draftIcon}
              onIconChange={editTrackIcon}
            />
            <Input
              aria-label={`${track.name} name`}
              onBlur={commitTrackEdits}
              onChange={(event) => setDraftName(event.currentTarget.value)}
              size="xs"
              value={draftName}
            />
          </Grid>
        ) : (
          <Heading lineHeight={1} minW={0} size="sm">
            {track.name}
          </Heading>
        )}

        <VolumeControl
          gridColumn={{ base: "2 / -1", sm: "auto" }}
          track={track}
          isMuted={isMuted}
          volume={volume}
          onMuteToggle={onMuteToggle}
          onVolumeChange={editTrackVolume}
        />

        <Button
          aria-label={`${isPlaying ? "Stop" : "Play"} ${track.name}`}
          disabled={track.hasMissingAudio}
          gridColumn={{ base: 3, sm: "auto" }}
          gridRow={{ base: 1, sm: "auto" }}
          onClick={() => onToggle(track)}
          size="xs"
          variant={isPlaying ? "solid" : "outline"}
          w="4rem"
        >
          <PlayStateIcon />
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </Grid>
    </Box>
  );
}
