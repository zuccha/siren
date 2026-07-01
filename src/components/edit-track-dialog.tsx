import { Dialog, Grid, Portal, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState, type KeyboardEvent } from "react";

import type { LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track } from "~/sound/tracks";
import AudioFileUpload from "~/ui/audio-file-upload";
import Button from "~/ui/button";
import Input from "~/ui/input";

import TrackIconPicker from "./track-icon-picker";

//------------------------------------------------------------------------------
// Edit Track Dialog
//------------------------------------------------------------------------------

type EditTrackDialogProps = {
  track: Track | undefined;
  onCancel: () => void;
  onEditTrack: (track: Track, input: LocalTrackUpdateInput) => Promise<void>;
};

export default function EditTrackDialog({ track, onCancel, onEditTrack }: EditTrackDialogProps) {
  const [draftName, setDraftName] = useState("");
  const [draftIcon, setDraftIcon] = useState("music");
  const [file, setFile] = useState<File>();
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const nextName = draftName.trim();

  useEffect(() => {
    setDraftName(track?.name ?? "");
    setDraftIcon(track?.icon ?? "music");
    setFile(undefined);
    setFileUploadKey((current) => current + 1);
  }, [track]);

  //------------------------------------------------------------------------------
  // Save Track
  //------------------------------------------------------------------------------

  const saveTrack = async () => {
    if (!track || !nextName || isSaving) return;

    setIsSaving(true);

    try {
      await onEditTrack(track, {
        name: nextName,
        icon: draftIcon,
        initialVolume: track.initialVolume,
        file,
      });
      onCancel();
    } finally {
      setIsSaving(false);
    }
  };

  //------------------------------------------------------------------------------
  // Handle Track Name Key Down
  //------------------------------------------------------------------------------

  const handleTrackNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") void saveTrack();
  };

  return (
    <Dialog.Root open={Boolean(track)} onOpenChange={(details) => !details.open && onCancel()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit track</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Grid gap={2} templateColumns="auto 1fr">
                  <TrackIconPicker
                    label={`${track?.name ?? "Track"} icon`}
                    value={draftIcon}
                    onIconChange={setDraftIcon}
                  />
                  <Input
                    aria-label="Track name"
                    autoFocus
                    onChange={(event) => setDraftName(event.currentTarget.value)}
                    onKeyDown={handleTrackNameKeyDown}
                    placeholder="Track name"
                    value={draftName}
                  />
                </Grid>
                <Stack gap={2}>
                  <Text color="fg.muted" fontSize="xs">
                    Current file: {track?.fileName}
                  </Text>
                  <AudioFileUpload resetKey={fileUploadKey} file={file} onFileChange={setFile} />
                </Stack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button disabled={isSaving} onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button disabled={!nextName || isSaving} onClick={saveTrack}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
