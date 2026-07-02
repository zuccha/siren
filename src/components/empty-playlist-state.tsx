import { Center, Stack } from "@chakra-ui/react";
import { DownloadIcon, PlusIcon } from "lucide-react";

import type { PresetImportOptions, PresetImportProgress } from "~/sound/presets";
import Button from "~/ui/button";

import AddPlaylistDialog from "./add-playlist-dialog";
import ImportPresetDialog from "./import-preset-dialog";

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

          <ImportPresetDialog onImportPreset={onImportPreset}>
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
              <DownloadIcon />
              Import preset (~37 MB)
            </Button>
          </ImportPresetDialog>
        </Stack>
      </Stack>
    </Center>
  );
}
