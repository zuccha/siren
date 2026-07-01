import { Dialog, Portal } from "@chakra-ui/react";
import { PencilIcon } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";

import type { TrackPlaylist } from "~/sound/tracks";
import Button from "~/ui/button";
import IconButton from "~/ui/icon-button";
import Input from "~/ui/input";

//------------------------------------------------------------------------------
// Edit Playlist Dialog
//------------------------------------------------------------------------------

type EditPlaylistDialogProps = {
  playlist: TrackPlaylist | undefined;
  onEditPlaylist: (playlistId: string, name: string) => void;
};

export default function EditPlaylistDialog({ playlist, onEditPlaylist }: EditPlaylistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState(playlist?.name ?? "");
  const nextPlaylistName = playlistName.trim();

  useEffect(() => {
    if (isOpen) setPlaylistName(playlist?.name ?? "");
  }, [isOpen, playlist?.name]);

  //------------------------------------------------------------------------------
  // Edit Playlist
  //------------------------------------------------------------------------------

  const editPlaylist = () => {
    if (!playlist || !nextPlaylistName) return;

    onEditPlaylist(playlist.id, nextPlaylistName);
    setIsOpen(false);
  };

  //------------------------------------------------------------------------------
  // Handle Playlist Name Key Down
  //------------------------------------------------------------------------------

  const handlePlaylistNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") editPlaylist();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <Dialog.Trigger asChild>
        <IconButton
          Icon={PencilIcon}
          aria-label="Edit selected playlist"
          disabled={!playlist}
          size="xs"
          variant="outline"
        />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit playlist</Dialog.Title>
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
              <Button disabled={!nextPlaylistName} onClick={editPlaylist}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
