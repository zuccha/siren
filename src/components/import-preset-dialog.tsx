import { Dialog, Portal, Stack, Text } from "@chakra-ui/react";
import { type ReactNode, useCallback, useState } from "react";

import type { PresetImportOptions, PresetImportProgress } from "~/sound/presets";
import Button from "~/ui/button";

//------------------------------------------------------------------------------
// Import Preset Dialog
//------------------------------------------------------------------------------

type ImportPresetDialogProps = {
  children: ReactNode;
  onImportPreset: (
    options: PresetImportOptions,
    onProgress?: (progress: PresetImportProgress) => void,
  ) => Promise<void>;
};

export default function ImportPresetDialog({ children, onImportPreset }: ImportPresetDialogProps) {
  const [error, setError] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState<PresetImportProgress>();

  //------------------------------------------------------------------------------
  // Import Preset
  //------------------------------------------------------------------------------

  const importPreset = useCallback(
    async (options: PresetImportOptions) => {
      setError(undefined);
      setProgress({ current: 0, total: 0 });

      try {
        await onImportPreset(options, setProgress);
        setIsOpen(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not import the preset.");
      } finally {
        setProgress(undefined);
      }
    },
    [onImportPreset],
  );

  const isImporting = Boolean(progress);

  //------------------------------------------------------------------------------
  // Change Open State
  //------------------------------------------------------------------------------

  const changeOpenState = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setError(undefined);
      setProgress(undefined);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => changeOpenState(details.open)}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Import preset</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={3}>
                <Text>
                  Import the bundled preset tracks into your library. You can also add the preset
                  playlist; it will be skipped if an identical one already exists.
                </Text>
                {isImporting && (
                  <Text fontSize="sm" fontVariantNumeric="tabular-nums">
                    {getImportLabel(progress)}
                  </Text>
                )}
                {error && (
                  <Text color="fg.error" fontSize="sm">
                    {error}
                  </Text>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button disabled={isImporting} variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                disabled={isImporting}
                loading={isImporting}
                onClick={() => importPreset({ shouldCreatePlaylists: false })}
                variant="outline"
              >
                Import tracks only
              </Button>
              <Button
                disabled={isImporting}
                loading={isImporting}
                onClick={() => importPreset({ shouldCreatePlaylists: true })}
              >
                Import tracks & playlist
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

//------------------------------------------------------------------------------
// Get Import Label
//------------------------------------------------------------------------------

function getImportLabel(progress: PresetImportProgress | undefined) {
  if (!progress?.total) return "Preparing preset import";

  return `Importing ${progress.current}/${progress.total}`;
}
