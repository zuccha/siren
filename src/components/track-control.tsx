import { Box, Button, Flex, Grid, Heading, Input } from "@chakra-ui/react";
import { GripVerticalIcon, PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState, type DragEvent } from "react";

import type { LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track } from "~/sound/tracks";
import IconButton from "~/ui/icon-button";

import VolumeControl from "./volume-control";

//------------------------------------------------------------------------------
// Track Control
//------------------------------------------------------------------------------

type TrackControlProps = {
  track: Track;
  isEditing: boolean;
  isDragging: boolean;
  isPlaying: boolean;
  volume: number;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent) => void;
  onDragStart: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
  onEdit: (track: Track, input: LocalTrackUpdateInput) => void;
  onRemove: (track: Track) => void;
  onToggle: (track: Track) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackControl({
  track,
  isEditing,
  isDragging,
  isPlaying,
  volume,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onEdit,
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
      initialVolume: volume,
    });
  };

  //------------------------------------------------------------------------------
  // Edit Track Volume
  //------------------------------------------------------------------------------

  const editTrackVolume = (trackId: string, nextVolume: number) => {
    if (!isEditing) {
      onVolumeChange(trackId, nextVolume);
      return;
    }

    onEdit(track, {
      name: draftName,
      icon: draftIcon,
      initialVolume: nextVolume,
    });
  };

  return (
    <Box
      bg="bg.panel"
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
      )}

      <Grid
        alignItems="center"
        gap={3}
        templateColumns="auto minmax(7rem, 1fr) minmax(9rem, 14rem) auto"
      >
        {isEditing ? (
          <Button
            aria-label={`Drag ${track.name}`}
            color="fg.muted"
            cursor="grab"
            draggable
            h={8}
            minW={8}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            p={0}
            size="xs"
            variant="plain"
            w={8}
            _active={{ cursor: "grabbing" }}
          >
            <GripVerticalIcon size={18} />
          </Button>
        ) : (
          <Flex align="center" color="fg.muted" h={8} justify="center" shrink={0} w={8}>
            <DynamicIcon name={track.icon} size={18} />
          </Flex>
        )}

        {isEditing ? (
          <Grid gap={2} minW={0} templateColumns="minmax(7rem, 1fr) minmax(5rem, 8rem)">
            <Input
              aria-label={`${track.name} name`}
              onBlur={commitTrackEdits}
              onChange={(event) => setDraftName(event.currentTarget.value)}
              size="xs"
              value={draftName}
            />
            <Input
              aria-label={`${track.name} icon`}
              onBlur={commitTrackEdits}
              onChange={(event) => setDraftIcon(event.currentTarget.value)}
              size="xs"
              value={draftIcon}
            />
          </Grid>
        ) : (
          <Heading minW={0} size="sm">
            {track.name}
          </Heading>
        )}

        <VolumeControl track={track} volume={volume} onVolumeChange={editTrackVolume} />

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
