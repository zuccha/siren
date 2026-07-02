import { Box, Portal, Tooltip } from "@chakra-ui/react";
import { TriangleAlertIcon } from "lucide-react";

import { getTrackIconComponent } from "~/sound/track-icons";
import type { Track } from "~/sound/tracks";

//------------------------------------------------------------------------------
// Track Status Icon
//------------------------------------------------------------------------------

type TrackStatusIconProps = {
  track: Track;
  size?: number;
};

export default function TrackStatusIcon({ track, size = 18 }: TrackStatusIconProps) {
  if (!track.hasMissingAudio) {
    const Icon = getTrackIconComponent(track.icon);
    return <Icon size={size} />;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Box as="span" color="fg.error" display="inline-flex">
          <TriangleAlertIcon size={size} />
        </Box>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>The audio file is missing or broken.</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
