import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

//------------------------------------------------------------------------------
// Dynamic Icon Button
//------------------------------------------------------------------------------

type DynamicIconButtonProps = Omit<ChakraIconButtonProps, "children" | "_icon"> & {
  icon: IconName;
};

export default function DynamicIconButton({ icon, size, ...rest }: DynamicIconButtonProps) {
  return (
    <ChakraIconButton {...rest} size={size}>
      <DynamicIcon name={icon} />
    </ChakraIconButton>
  );
}
