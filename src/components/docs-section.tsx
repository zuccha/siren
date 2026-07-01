import { Stack, Text, type StackProps } from "@chakra-ui/react";

import type { ReactNode } from "react";

//------------------------------------------------------------------------------
// Docs Section
//------------------------------------------------------------------------------

type DocsSectionProps = Omit<StackProps, "children"> & {
  children: ReactNode;
  title: string;
  visual?: ReactNode;
};

export default function DocsSection({ children, title, visual, ...rest }: DocsSectionProps) {
  return (
    <Stack as="section" gap={3} w="full" {...rest}>
      <Text fontWeight="semibold">{title}</Text>
      <Stack gap={2}>{children}</Stack>
      {visual && <Stack align="center">{visual}</Stack>}
    </Stack>
  );
}
