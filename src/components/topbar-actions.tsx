import { CheckIcon, InfoIcon, LibraryIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

import type { LocalTrackInput, LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { Track } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";
import EditModeSwitch from "~/ui/edit-mode-switch";
import IconButton from "~/ui/icon-button";

import TrackLibraryDrawer from "./track-library-drawer";

//------------------------------------------------------------------------------
// Topbar Actions
//------------------------------------------------------------------------------

type TopbarActionsProps = {
  isEditing: boolean;
  tracks: Track[];
  onAddTrack: (input: LocalTrackInput) => Promise<void>;
  onDeleteTrack: (track: Track) => Promise<void>;
  onEditTrack: (track: Track, input: LocalTrackUpdateInput) => Promise<void>;
  onEditingChange: (isEditing: boolean) => void;
  onInfoOpen: () => void;
};

export default function TopbarActions({
  isEditing,
  tracks,
  onAddTrack,
  onDeleteTrack,
  onEditTrack,
  onEditingChange,
  onInfoOpen,
}: TopbarActionsProps) {
  const [isTrackLibraryOpen, setIsTrackLibraryOpen] = useState(false);
  const EditIcon = isEditing ? CheckIcon : PencilIcon;

  return (
    <>
      <EditModeSwitch
        display={{ base: "none", sm: "inline-flex" }}
        isEditing={isEditing}
        onEditingChange={onEditingChange}
      />

      <IconButton
        Icon={EditIcon}
        aria-label={isEditing ? "Done editing" : "Edit mode"}
        display={{ base: "inline-flex", sm: "none" }}
        onClick={() => onEditingChange(!isEditing)}
        size="sm"
        variant={isEditing ? "solid" : "outline"}
      />

      <TrackLibraryDrawer
        hideMobileTrigger
        isOpen={isTrackLibraryOpen}
        tracks={tracks}
        onAddTrack={onAddTrack}
        onDeleteTrack={onDeleteTrack}
        onEditTrack={onEditTrack}
        onOpenChange={setIsTrackLibraryOpen}
      />

      <IconButton
        Icon={LibraryIcon}
        aria-label="Open tracks"
        display={{ base: "inline-flex", sm: "none" }}
        onClick={() => setIsTrackLibraryOpen(true)}
        size="sm"
        variant="outline"
      />

      <IconButton
        Icon={InfoIcon}
        aria-label="About SirenSong"
        onClick={onInfoOpen}
        size="sm"
        variant="outline"
      />

      <ThemeButton />
    </>
  );
}
