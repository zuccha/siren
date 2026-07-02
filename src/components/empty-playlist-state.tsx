import { Center, Stack, Text } from "@chakra-ui/react";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";

import type { PresetImportOptions, PresetImportProgress } from "~/sound/presets";
import Button from "~/ui/button";

import AddPlaylistDialog from "./add-playlist-dialog";

//------------------------------------------------------------------------------
// Empty Playlist State
//------------------------------------------------------------------------------

type EmptyPlaylistStateProps = {
  onImportPreset: (
    options: PresetImportOptions,
    onProgress?: (progress: PresetImportProgress) => void,
  ) => Promise<void>;
  onAddPlaylist: (name: string) => void;
};

export default function EmptyPlaylistState({
  onAddPlaylist,
  onImportPreset,
}: EmptyPlaylistStateProps) {
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<PresetImportProgress>();

  //------------------------------------------------------------------------------
  // Import Preset
  //------------------------------------------------------------------------------

  const importPreset = useCallback(async () => {
    setError(undefined);
    setProgress({ current: 0, total: 0 });

    try {
      await onImportPreset({ shouldCreatePlaylists: true }, setProgress);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not import the preset.");
    } finally {
      setProgress(undefined);
    }
  }, [onImportPreset]);

  const isImporting = Boolean(progress);

  return (
    <Center minH="50vh">
      <Stack align="center" gap={3} maxW="32rem" w="full">
        <Stack gap={3} w="full" flexWrap={{ base: "wrap", sm: "nowrap" }}>
          <AddPlaylistDialog onAddPlaylist={onAddPlaylist}>
            <Button
              borderColor="fg.muted"
              borderStyle="dashed"
              borderWidth="1px"
              color="fg.muted"
              h="6rem"
              minW={{ base: "100%", sm: 0 }}
              rounded="md"
              size="md"
              variant="ghost"
              w="full"
              _hover={{ bg: "bg.emphasized", borderColor: "fg", color: "fg" }}
            >
              <PlusIcon />
              Create your own playlist
            </Button>
          </AddPlaylistDialog>

          <Button
            borderColor="fg.muted"
            borderStyle="dashed"
            borderWidth="1px"
            color="fg.muted"
            disabled={isImporting}
            h="6rem"
            loading={isImporting}
            minW={{ base: "100%", sm: 0 }}
            onClick={importPreset}
            rounded="md"
            size="md"
            variant="ghost"
            w="full"
            _hover={{ bg: "bg.emphasized", borderColor: "fg", color: "fg" }}
          >
            <DownloadIcon />
            {isImporting ? getImportLabel(progress) : "Import preset (~37 MB)"}
          </Button>
        </Stack>

        {error && (
          <Text color="fg.error" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </Stack>
    </Center>
  );
}

//------------------------------------------------------------------------------
// Get Import Label
//------------------------------------------------------------------------------

function getImportLabel(progress: PresetImportProgress | undefined) {
  if (!progress?.total) return "Preparing preset import";

  return `Importing ${progress.current}/${progress.total}`;
}
