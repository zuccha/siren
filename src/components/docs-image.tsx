import { Box, Image, Stack, Text, type StackProps } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// Docs Image
//------------------------------------------------------------------------------

type DocsImageProps = Omit<StackProps, "children"> & {
  alt: string;
  caption: string;
  src: string;
};

export default function DocsImage({ alt, caption, src, ...rest }: DocsImageProps) {
  return (
    <Stack align="center" as="figure" gap={1} {...rest}>
      <Box borderColor="border" borderWidth={1} p={1} rounded="sm">
        <Image alt={alt} src={src} />
      </Box>
      <Text as="figcaption" textAlign="center" fontSize="xs" fontStyle="italic">
        {caption}
      </Text>
    </Stack>
  );
}
