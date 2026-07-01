import { Grid, Stack, Text, type GridProps } from "@chakra-ui/react";

import type { ReactNode } from "react";

//------------------------------------------------------------------------------
// Docs Section
//------------------------------------------------------------------------------

type DocsSectionProps = Omit<GridProps, "children"> & {
  children: ReactNode;
  title: string;
  visual: ReactNode;
  visualPosition?: "left" | "right";
};

export default function DocsSection({
  children,
  title,
  visual,
  visualPosition = "right",
  ...rest
}: DocsSectionProps) {
  const desktopAreas = visualPosition === "left" ? `"visual content"` : `"content visual"`;
  const desktopColumns =
    visualPosition === "left" ? "max-content minmax(0, 1fr)" : "minmax(0, 1fr) max-content";

  return (
    <Grid
      alignItems="center"
      gap={{ base: 3, md: 6 }}
      templateAreas={{ base: `"content" "visual"`, md: desktopAreas }}
      templateColumns={{ base: "1fr", md: desktopColumns }}
      {...rest}
    >
      <Stack gap={2} gridArea="content">
        <Text fontWeight="semibold">{title}</Text>
        {children}
      </Stack>
      <Stack gridArea="visual">{visual}</Stack>
    </Grid>
  );
}
