import { Box, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { CircleOffIcon } from "lucide-react";
import { Fragment, useState, type DragEvent } from "react";

import type { LocalTrackInput, LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track, TrackDropPosition } from "~/sound/tracks";

import ExistingTrackList from "./existing-track-list";
import TrackControl from "./track-control";
import TrackUpload from "./track-upload";

//------------------------------------------------------------------------------
// Track Drop Target
//------------------------------------------------------------------------------

type TrackDropTarget = {
  position: TrackDropPosition;
  trackId: string;
};

const trackListGap = 2;
const trackListGapCenterOffset = `calc(var(--chakra-spacing-${trackListGap}) / -2)`;

//------------------------------------------------------------------------------
// Track Section
//------------------------------------------------------------------------------

type TrackSectionProps = {
  defaultIcon: string;
  kind: Track["kind"];
  title: string;
  availableTracks: Track[];
  tracks: Track[];
  isEditing: boolean;
  playingIds: Set<string>;
  volumes: Record<string, number>;
  onAddTrack: (track: Track) => void;
  onEdit: (track: Track, input: LocalTrackUpdateInput) => void;
  onRemove: (track: Track) => void;
  onReorder: (
    kind: Track["kind"],
    sourceId: string,
    targetId: string,
    position: TrackDropPosition,
  ) => void;
  onToggle: (track: Track) => void;
  onUpload: (input: LocalTrackInput) => Promise<void>;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export default function TrackSection({
  defaultIcon,
  kind,
  title,
  availableTracks,
  tracks,
  isEditing,
  playingIds,
  volumes,
  onAddTrack,
  onEdit,
  onRemove,
  onReorder,
  onToggle,
  onUpload,
  onVolumeChange,
}: TrackSectionProps) {
  const [draggedTrackId, setDraggedTrackId] = useState<string>();
  const [dropTarget, setDropTarget] = useState<TrackDropTarget>();

  //------------------------------------------------------------------------------
  // Start Track Drag
  //------------------------------------------------------------------------------

  const startTrackDrag = (event: DragEvent, track: Track) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", track.id);
    setDraggedTrackId(track.id);
  };

  //------------------------------------------------------------------------------
  // Resolve Drop Target
  //------------------------------------------------------------------------------

  const resolveDropTarget = (
    sourceId: string,
    targetTrack: Track,
    position: TrackDropPosition,
  ): TrackDropTarget | undefined => {
    const sourceIndex = tracks.findIndex((track) => track.id === sourceId);
    const targetIndex = tracks.findIndex((track) => track.id === targetTrack.id);

    if (sourceIndex < 0 || targetIndex < 0) return undefined;

    const insertionIndex = position === "after" ? targetIndex + 1 : targetIndex;
    if (insertionIndex === sourceIndex || insertionIndex === sourceIndex + 1) return undefined;

    const insertionTrack = tracks[insertionIndex];
    if (insertionTrack) return { trackId: insertionTrack.id, position: "before" };

    const lastTrack = tracks.at(-1);
    if (lastTrack) return { trackId: lastTrack.id, position: "after" };

    return undefined;
  };

  //------------------------------------------------------------------------------
  // Drag Over Track
  //------------------------------------------------------------------------------

  const dragOverTrack = (event: DragEvent, track: Track) => {
    if (!isEditing) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const sourceId = event.dataTransfer.getData("text/plain") || draggedTrackId;
    if (!sourceId || sourceId === track.id) {
      setDropTarget(undefined);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    setDropTarget(resolveDropTarget(sourceId, track, position));
  };

  //------------------------------------------------------------------------------
  // Drop Track
  //------------------------------------------------------------------------------

  const dropTrack = (event: DragEvent, targetTrack: Track) => {
    event.preventDefault();

    const sourceId = event.dataTransfer.getData("text/plain") || draggedTrackId;
    const target = dropTarget ?? { trackId: targetTrack.id, position: "before" };
    setDraggedTrackId(undefined);
    setDropTarget(undefined);

    if (!sourceId || sourceId === target.trackId) return;
    if (!tracks.some((track) => track.id === sourceId)) return;
    if (!tracks.some((track) => track.id === target.trackId)) return;

    onReorder(kind, sourceId, target.trackId, target.position);
  };

  //------------------------------------------------------------------------------
  // End Track Drag
  //------------------------------------------------------------------------------

  const endTrackDrag = () => {
    setDraggedTrackId(undefined);
    setDropTarget(undefined);
  };

  //------------------------------------------------------------------------------
  // Has Drop Indicator
  //------------------------------------------------------------------------------

  const hasDropIndicator = (track: Track | undefined, position: TrackDropPosition) => {
    return Boolean(track && dropTarget?.trackId === track.id && dropTarget.position === position);
  };

  return (
    <Box as="section">
      <Heading as="h2" size="md" mb={3}>
        {title}
      </Heading>
      <Stack gap={0}>
        {tracks.length === 0 && (
          <Box
            alignItems="center"
            bg="transparent"
            borderColor="border.emphasized"
            borderStyle="dashed"
            borderWidth="1px"
            color="fg.muted"
            display="flex"
            gap={2}
            px={3}
            py={2}
            rounded="sm"
          >
            <HStack h={8}>
              <Icon color="fg.subtle" size="sm">
                <CircleOffIcon />
              </Icon>
              <Text fontSize="sm">This list is empty.</Text>
            </HStack>
          </Box>
        )}
        {tracks.map((track, trackIndex) => (
          <Fragment key={track.id}>
            <Box h={trackIndex === 0 ? 0 : trackListGap} position="relative">
              {hasDropIndicator(track, "before") && (
                <Box
                  bg="fg"
                  h="2px"
                  insetInline={2}
                  pointerEvents="none"
                  position="absolute"
                  top={trackIndex === 0 ? trackListGapCenterOffset : "50%"}
                  transform="translateY(-50%)"
                  zIndex={1}
                />
              )}
            </Box>
            <TrackControl
              track={track}
              isEditing={isEditing}
              isDragging={draggedTrackId === track.id}
              isPlaying={playingIds.has(track.id)}
              volume={volumes[track.id] ?? track.initialVolume}
              onDragEnd={endTrackDrag}
              onDragOver={(event) => dragOverTrack(event, track)}
              onDragStart={(event) => startTrackDrag(event, track)}
              onDrop={(event) => dropTrack(event, track)}
              onEdit={onEdit}
              onRemove={onRemove}
              onToggle={onToggle}
              onVolumeChange={onVolumeChange}
            />
          </Fragment>
        ))}
        <Box h={tracks.length > 0 ? trackListGap : 0} position="relative">
          {hasDropIndicator(tracks.at(-1), "after") && (
            <Box
              bg="fg"
              h="2px"
              insetInline={2}
              pointerEvents="none"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              zIndex={1}
            />
          )}
        </Box>
        {isEditing && (
          <Stack gap={2} mt={tracks.length > 0 ? 0 : 2}>
            <ExistingTrackList tracks={availableTracks} onAddTrack={onAddTrack} />
            <TrackUpload kind={kind} defaultIcon={defaultIcon} onUpload={onUpload} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
