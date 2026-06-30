import { Button, Dialog, Portal, Text } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { useState, type MouseEvent } from "react";

import type { TrackPlaylist } from "~/sound/tracks";
import IconButton from "~/ui/icon-button";

//------------------------------------------------------------------------------
// Delete Playlist Button
//------------------------------------------------------------------------------

type DeletePlaylistButtonProps = {
  playlist: TrackPlaylist;
  disabled: boolean;
  isSelected: boolean;
  onRemovePlaylist: (playlistId: string) => void;
};

export default function DeletePlaylistButton({
  playlist,
  disabled,
  isSelected,
  onRemovePlaylist,
}: DeletePlaylistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasTracks = playlist.ambienceTrackIds.length > 0 || playlist.environmentTrackIds.length > 0;

  //------------------------------------------------------------------------------
  // Remove Playlist
  //------------------------------------------------------------------------------

  const removePlaylist = () => {
    onRemovePlaylist(playlist.id);
    setIsOpen(false);
  };

  //------------------------------------------------------------------------------
  // Request Remove Playlist
  //------------------------------------------------------------------------------

  const requestRemovePlaylist = () => {
    if (hasTracks) {
      setIsOpen(true);
      return;
    }

    removePlaylist();
  };

  //------------------------------------------------------------------------------
  // Handle Close Trigger Click
  //------------------------------------------------------------------------------

  const handleCloseTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    requestRemovePlaylist();
  };

  return (
    <>
      <IconButton
        Icon={XIcon}
        aria-label={`Delete ${playlist.name}`}
        color={isSelected ? "bg" : "fg.muted"}
        disabled={disabled}
        h={5}
        minW={5}
        mr={1}
        onClick={handleCloseTriggerClick}
        rounded="full"
        size="2xs"
        variant="plain"
        w={5}
        zIndex={1}
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
                <Button colorPalette="red" onClick={removePlaylist}>
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
