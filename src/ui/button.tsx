import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// Button
//------------------------------------------------------------------------------

export type ButtonProps = Omit<ChakraButtonProps, "_icon">;

export default function Button({ size, ...rest }: ButtonProps) {
  return <ChakraButton {...rest} size={size} _icon={getButtonIconStyles(size)} />;
}

//------------------------------------------------------------------------------
// Button Icon Size
//------------------------------------------------------------------------------

type ButtonIconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const iconBoxSizeByButtonSize: Record<ButtonIconSize, string> = {
  "2xs": "3",
  "xs": "3",
  "sm": "4",
  "md": "5",
  "lg": "6",
  "xl": "7",
  "2xl": "8",
};

//------------------------------------------------------------------------------
// Get Button Icon Styles
//------------------------------------------------------------------------------

function getButtonIconStyles(size: ButtonProps["size"]) {
  const buttonSize = typeof size === "string" ? size : "md";
  const boxSize = isButtonIconSize(buttonSize) ? iconBoxSizeByButtonSize[buttonSize] : "5";

  return {
    height: boxSize,
    width: boxSize,
  };
}

//------------------------------------------------------------------------------
// Is Button Icon Size
//------------------------------------------------------------------------------

function isButtonIconSize(size: string): size is ButtonIconSize {
  return size in iconBoxSizeByButtonSize;
}
