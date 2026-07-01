import { Button, Center } from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";

import { getButtonIconStyles } from "~/ui/button-icon-styles";

import AddPlaylistDialog from "./add-playlist-dialog";

//------------------------------------------------------------------------------
// Empty Playlist State
//------------------------------------------------------------------------------

type EmptyPlaylistStateProps = {
  onAddPlaylist: (name: string) => void;
};

export default function EmptyPlaylistState({ onAddPlaylist }: EmptyPlaylistStateProps) {
  return (
    <Center minH="50vh">
      <AddPlaylistDialog onAddPlaylist={onAddPlaylist}>
        <Button
          borderColor="fg.muted"
          borderStyle="dashed"
          borderWidth="1px"
          color="fg.muted"
          h="6rem"
          maxW="22rem"
          rounded="md"
          size="md"
          variant="ghost"
          w="full"
          _hover={{ bg: "bg.emphasized", borderColor: "fg", color: "fg" }}
          _icon={getButtonIconStyles("md")}
        >
          <PlusIcon />
          Create a playlist
        </Button>
      </AddPlaylistDialog>
    </Center>
  );
}
