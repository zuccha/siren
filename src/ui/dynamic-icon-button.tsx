import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import { getButtonIconStyles } from "./button-icon-styles";

//------------------------------------------------------------------------------
// Dynamic Icon Button
//------------------------------------------------------------------------------

type DynamicIconButtonProps = Omit<ChakraIconButtonProps, "children" | "_icon"> & {
  icon: IconName;
};

export default function DynamicIconButton({ icon, size, ...rest }: DynamicIconButtonProps) {
  return (
    <ChakraIconButton rounded="full" {...rest} size={size} _icon={getButtonIconStyles(size)}>
      <DynamicIcon name={icon} />
    </ChakraIconButton>
  );
}
