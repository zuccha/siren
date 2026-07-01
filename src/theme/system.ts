import { createSystem, defaultConfig } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// System
//------------------------------------------------------------------------------

export const system = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      xs: "15rem",
    },
    recipes: {
      heading: {
        variants: {
          size: {
            "2xl": { lineHeight: 1.2 },
            "3xl": { lineHeight: 1.2 },
            "lg": { lineHeight: 1.2 },
            "md": { lineHeight: 1.2 },
          },
        },
      },
      text: {
        base: {
          lineHeight: 1.2,
        },
      },
    },
    semanticTokens: {
      colors: {
        accent: {
          border: {
            value: { _dark: "{colors.gray.800}", _light: "{colors.gray.200}" },
          },
          contrast: {
            value: { _dark: "{colors.black}", _light: "{colors.white}" },
          },
          emphasized: {
            value: { _dark: "{colors.gray.700}", _light: "{colors.gray.300}" },
          },
          fg: {
            value: { _dark: "{colors.gray.200}", _light: "{colors.gray.800}" },
          },
          focusRing: {
            value: { _dark: "{colors.gray.400}", _light: "{colors.gray.400}" },
          },
          muted: {
            value: { _dark: "{colors.gray.800}", _light: "{colors.gray.200}" },
          },
          solid: {
            value: { _dark: "{colors.white}", _light: "{colors.gray.900}" },
          },
          subtle: {
            value: { _dark: "{colors.gray.900}", _light: "{colors.gray.100}" },
          },
        },
      },
    },
    tokens: {},
  },
});
