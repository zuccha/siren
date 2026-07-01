import type { IconButtonProps } from "@chakra-ui/react";

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

export function getButtonIconStyles(size: IconButtonProps["size"]) {
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
