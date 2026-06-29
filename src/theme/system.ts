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
    tokens: {},
  },
});
