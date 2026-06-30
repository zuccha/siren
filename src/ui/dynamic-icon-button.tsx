import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

//------------------------------------------------------------------------------
// Dynamic Icon Button
//------------------------------------------------------------------------------

type DynamicIconButtonProps = Omit<ChakraIconButtonProps, "children"> & {
  icon: IconName;
  iconSize?: number;
};

export default function DynamicIconButton({
  icon,
  iconSize = 18,
  ...rest
}: DynamicIconButtonProps) {
  return (
    <ChakraIconButton rounded="full" {...rest}>
      <DynamicIcon name={icon} size={iconSize} />
    </ChakraIconButton>
  );
}
