import { Dialog, Portal, Text } from "@chakra-ui/react";

import type { Track } from "~/sound/tracks";
import Button from "~/ui/button";

//------------------------------------------------------------------------------
// Delete Track Dialog
//------------------------------------------------------------------------------

type DeleteTrackDialogProps = {
  track: Track | undefined;
  onCancel: () => void;
  onDelete: () => void;
};

export default function DeleteTrackDialog({ track, onCancel, onDelete }: DeleteTrackDialogProps) {
  return (
    <Dialog.Root open={Boolean(track)} onOpenChange={(details) => !details.open && onCancel()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete track?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                This will delete {track?.name} from your library, remove it from every playlist, and
                delete the stored audio file from this browser.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={onDelete}>Delete</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
