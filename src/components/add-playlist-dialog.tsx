import { Button, Dialog, Input, Portal } from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { type ReactNode, useState, type KeyboardEvent } from "react";

import IconButton from "~/ui/icon-button";

//------------------------------------------------------------------------------
// Add Playlist Dialog
//------------------------------------------------------------------------------

type AddPlaylistDialogProps = {
  children?: ReactNode;
  onAddPlaylist: (name: string) => void;
};

export default function AddPlaylistDialog({ children, onAddPlaylist }: AddPlaylistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  //------------------------------------------------------------------------------
  // Add Playlist
  //------------------------------------------------------------------------------

  const addPlaylist = () => {
    const name = playlistName.trim();
    if (!name) return;

    onAddPlaylist(name);
    setPlaylistName("");
    setIsOpen(false);
  };

  //------------------------------------------------------------------------------
  // Handle Playlist Name Key Down
  //------------------------------------------------------------------------------

  const handlePlaylistNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addPlaylist();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <Dialog.Trigger asChild>
        {children ?? (
          <IconButton
            Icon={PlusIcon}
            aria-label="Add playlist"
            borderColor="border"
            borderWidth={1}
            mr={2}
            size="xs"
            variant="subtle"
          />
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add playlist</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                aria-label="Playlist name"
                autoFocus
                onChange={(event) => setPlaylistName(event.currentTarget.value)}
                onKeyDown={handlePlaylistNameKeyDown}
                placeholder="Playlist name"
                value={playlistName}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button disabled={!playlistName.trim()} onClick={addPlaylist}>
                Add
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
