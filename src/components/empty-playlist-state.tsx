import { Center, Stack, Text } from "@chakra-ui/react";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";

import Button from "~/ui/button";

import AddPlaylistDialog from "./add-playlist-dialog";

//------------------------------------------------------------------------------
// Empty Playlist State
//------------------------------------------------------------------------------

type EmptyPlaylistStateProps = {
  onImportPreset: (
    onProgress?: (progress: { current: number; total: number }) => void,
  ) => Promise<void>;
  onAddPlaylist: (name: string) => void;
};

export default function EmptyPlaylistState({
  onAddPlaylist,
  onImportPreset,
}: EmptyPlaylistStateProps) {
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<{ current: number; total: number }>();

  //------------------------------------------------------------------------------
  // Import Preset
  //------------------------------------------------------------------------------

  const importPreset = useCallback(async () => {
    setError(undefined);
    setProgress({ current: 0, total: 0 });

    try {
      await onImportPreset(setProgress);
    } catch (error) {
      setProgress(undefined);
      setError(error instanceof Error ? error.message : "Could not import the preset.");
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
            rounded="md"
            size="md"
            variant="ghost"
            w="full"
            _hover={{ bg: "bg.emphasized", borderColor: "fg", color: "fg" }}
            onClick={importPreset}
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

function getImportLabel(progress: { current: number; total: number } | undefined) {
  if (!progress?.total) return "Importing preset";

  return `Importing ${progress.current}/${progress.total}`;
}
