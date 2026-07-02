import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";

import { getTrackIconComponent, type TrackIconName } from "~/sound/track-icons";

//------------------------------------------------------------------------------
// Track Icon Button
//------------------------------------------------------------------------------

type TrackIconButtonProps = Omit<ChakraIconButtonProps, "children" | "_icon"> & {
  icon: TrackIconName;
};

export default function TrackIconButton({ icon, size, ...rest }: TrackIconButtonProps) {
  const Icon = getTrackIconComponent(icon);

  return (
    <ChakraIconButton colorPalette="accent" {...rest} size={size}>
      <Icon />
    </ChakraIconButton>
  );
}
