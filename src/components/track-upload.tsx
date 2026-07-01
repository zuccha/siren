import { Box, Button, Grid, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { UploadIcon } from "lucide-react";
import { useState } from "react";

import type { LocalTrackInput } from "~/sound/local-tracks";
import type { TrackKind } from "~/sound/tracks";
import AudioFileUpload from "~/ui/audio-file-upload";
import { getButtonIconStyles } from "~/ui/button-icon-styles";
import VolumeSlider from "~/ui/volume-slider";

import TrackIconPicker from "./track-icon-picker";

//------------------------------------------------------------------------------
// Track Upload
//------------------------------------------------------------------------------

type TrackUploadProps = {
  kind: TrackKind;
  defaultIcon: string;
  onUpload: (input: LocalTrackInput) => Promise<void>;
};

export default function TrackUpload({ kind, defaultIcon, onUpload }: TrackUploadProps) {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(defaultIcon);
  const [initialVolume, setInitialVolume] = useState(50);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [error, setError] = useState<string>();

  //------------------------------------------------------------------------------
  // Upload Track
  //------------------------------------------------------------------------------

  const uploadTrack = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(undefined);

    try {
      await onUpload({ file, icon, initialVolume, kind, name });
      resetForm();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not save track.");
    } finally {
      setIsUploading(false);
    }
  };

  //------------------------------------------------------------------------------
  // Select File
  //------------------------------------------------------------------------------

  const selectFile = (selectedFile: File | undefined) => {
    setFile(selectedFile);
    if (selectedFile && !name) setName(removeFileExtension(selectedFile.name));
  };

  //------------------------------------------------------------------------------
  // Reset Form
  //------------------------------------------------------------------------------

  const resetForm = () => {
    setFile(undefined);
    setName("");
    setIcon(defaultIcon);
    setInitialVolume(50);
    setFileUploadKey((previous) => previous + 1);
  };

  return (
    <Box bg="bg.panel" borderColor="border" borderWidth="1px" px={3} py={2} rounded="sm">
      <Grid alignItems="center" gap={2} templateColumns="auto minmax(9rem, 1fr) auto">
        <TrackIconPicker label="New track icon" size="xs" value={icon} onIconChange={setIcon} />
        <Input
          aria-label="Track name"
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Track name"
          size="xs"
          value={name}
        />
        <Button
          disabled={!file || isUploading}
          loading={isUploading}
          onClick={uploadTrack}
          size="xs"
          _icon={getButtonIconStyles("xs")}
        >
          <Icon size="xs">
            <UploadIcon />
          </Icon>
          Add
        </Button>
      </Grid>

      <Grid alignItems="center" gap={2} mt={2} templateColumns={{ base: "1fr", sm: "2fr 1fr" }}>
        <AudioFileUpload resetKey={fileUploadKey} file={file} onFileChange={selectFile} />
        <HStack gap={0.5}>
          <VolumeSlider
            aria-label="Initial volume"
            value={initialVolume}
            onValueChange={setInitialVolume}
          />
          <Text
            color="fg.muted"
            fontSize="xs"
            fontVariantNumeric="tabular-nums"
            minW="3ch"
            textAlign="right"
          >
            {initialVolume}
          </Text>
        </HStack>
      </Grid>

      {error && (
        <Text color="fg.error" fontSize="xs" mt={2}>
          {error}
        </Text>
      )}
    </Box>
  );
}

//------------------------------------------------------------------------------
// Remove File Extension
//------------------------------------------------------------------------------

function removeFileExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}
