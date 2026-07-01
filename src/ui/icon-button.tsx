import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
  createIcon,
} from "@chakra-ui/react";

import { getButtonIconStyles } from "./button-icon-styles";

import type { LucideIcon } from "lucide-react";

//------------------------------------------------------------------------------
// Icon Button
//------------------------------------------------------------------------------

export type IconButtonProps = Omit<ChakraIconButtonProps, "children" | "_icon"> & {
  Icon: LucideIcon | ReturnType<typeof createIcon>;
};

export default function IconButton({ Icon, size, ...rest }: IconButtonProps) {
  return (
    <ChakraIconButton rounded="full" {...rest} size={size} _icon={getButtonIconStyles(size)}>
      <Icon />
    </ChakraIconButton>
  );
}
