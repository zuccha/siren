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
            value: { _dark: "{colors.sea.700}", _light: "{colors.sea.200}" },
          },
          contrast: {
            value: { _dark: "{colors.black}", _light: "{colors.white}" },
          },
          emphasized: {
            value: { _dark: "{colors.sea.800}", _light: "{colors.sea.100}" },
          },
          fg: {
            value: { _dark: "{colors.gray.200}", _light: "{colors.gray.800}" },
          },
          focusRing: {
            value: { _dark: "{colors.gray.400}", _light: "{colors.gray.400}" },
          },
          muted: {
            value: { _dark: "{colors.sea.900}", _light: "{colors.sea.50}" },
          },
          solid: {
            value: { _dark: "{colors.white}", _light: "{colors.gray.900}" },
          },
          subtle: {
            value: { _dark: "{colors.sea.900}", _light: "{colors.sea.25}" },
          },
        },
        bg: {
          DEFAULT: {
            value: { _dark: "{colors.sea.950}", _light: "{colors.sea.50}" },
          },
          emphasized: {
            value: { _dark: "{colors.sea.800}", _light: "{colors.sea.100}" },
          },
          panel: {
            value: { _dark: "{colors.sea.900}", _light: "{colors.white}" },
          },
          subtle: {
            value: { _dark: "{colors.sea.850}", _light: "{colors.sea.25}" },
          },
        },
        border: {
          value: { _dark: "{colors.sea.700}", _light: "{colors.sea.200}" },
        },
      },
    },
    tokens: {
      colors: {
        sea: {
          "25": { value: "#f7fbfc" },
          "50": { value: "#eef7f8" },
          "100": { value: "#dcecef" },
          "200": { value: "#bfd5da" },
          "300": { value: "#93b8c0" },
          "400": { value: "#6798a4" },
          "500": { value: "#437a87" },
          "600": { value: "#35636d" },
          "700": { value: "#2e4a50" },
          "800": { value: "#1c3337" },
          "850": { value: "#132a2d" },
          "900": { value: "#102225" },
          "950": { value: "#071416" },
        },
      },
    },
  },
});
