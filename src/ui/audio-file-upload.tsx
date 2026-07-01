import { FileUpload, HStack, type FileUploadRootProps } from "@chakra-ui/react";

import Button from "./button";

//------------------------------------------------------------------------------
// Audio File Upload
//------------------------------------------------------------------------------

type AudioFileUploadProps = Omit<
  FileUploadRootProps,
  "accept" | "children" | "maxFiles" | "onFileChange"
> & {
  resetKey: number;
  file: File | undefined;
  onFileChange: (file: File | undefined) => void;
};

export default function AudioFileUpload({
  resetKey,
  file,
  onFileChange,
  ...rest
}: AudioFileUploadProps) {
  return (
    <FileUpload.Root
      key={resetKey}
      accept="audio/*"
      flex="1"
      maxFiles={1}
      minW={0}
      onFileChange={(details) => onFileChange(details.acceptedFiles[0])}
      {...rest}
    >
      <FileUpload.HiddenInput />
      <HStack gap={2} minW={0}>
        <FileUpload.Trigger asChild>
          <Button flexShrink={0} size="xs" variant="outline">
            Choose file
          </Button>
        </FileUpload.Trigger>
        <FileUpload.FileText
          color="fg.muted"
          flex={1}
          fallback={file ? file.name : "No file selected"}
          fontSize="xs"
          minW={0}
          truncate
        />
      </HStack>
    </FileUpload.Root>
  );
}
