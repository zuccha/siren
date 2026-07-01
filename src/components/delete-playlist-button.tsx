import { Dialog, Portal, Text } from "@chakra-ui/react";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import type { TrackPlaylist } from "~/sound/tracks";
import Button from "~/ui/button";
import IconButton from "~/ui/icon-button";

//------------------------------------------------------------------------------
// Delete Playlist Button
//------------------------------------------------------------------------------

type DeletePlaylistButtonProps = {
  playlist: TrackPlaylist | undefined;
  disabled: boolean;
  onRemovePlaylist: (playlistId: string) => void;
};

export default function DeletePlaylistButton({
  playlist,
  disabled,
  onRemovePlaylist,
}: DeletePlaylistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasTracks = playlist
    ? playlist.ambienceTrackIds.length > 0 || playlist.environmentTrackIds.length > 0
    : false;

  //------------------------------------------------------------------------------
  // Remove Playlist
  //------------------------------------------------------------------------------

  const removePlaylist = () => {
    if (!playlist) return;

    onRemovePlaylist(playlist.id);
    setIsOpen(false);
  };

  //------------------------------------------------------------------------------
  // Request Remove Playlist
  //------------------------------------------------------------------------------

  const requestRemovePlaylist = () => {
    if (!playlist) return;

    if (hasTracks) {
      setIsOpen(true);
      return;
    }

    removePlaylist();
  };

  return (
    <>
      <IconButton
        Icon={Trash2Icon}
        aria-label={playlist ? `Delete ${playlist.name}` : "Delete selected playlist"}
        disabled={disabled}
        onClick={requestRemovePlaylist}
        size="xs"
        variant="outline"
      />
      <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete playlist?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  This playlist contains tracks. Deleting it will remove the playlist, but the
                  tracks will stay in your library.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={removePlaylist}>Delete</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
