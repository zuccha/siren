import { CheckIcon, InfoIcon, LibraryIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

import { useEditMode } from "~/edit-mode";
import type { LocalTrackInput, LocalTrackUpdateInput } from "~/sound/local-tracks";
import type { PresetImportOptions, PresetImportProgress } from "~/sound/presets";
import type { Track } from "~/sound/tracks";
import ThemeButton from "~/theme/theme-button";
import EditModeSwitch from "~/ui/edit-mode-switch";
import IconButton from "~/ui/icon-button";

import TrackLibraryDrawer from "./track-library-drawer";

//------------------------------------------------------------------------------
// Topbar Actions
//------------------------------------------------------------------------------

type TopbarActionsProps = {
  tracks: Track[];
  onAddTrack: (input: LocalTrackInput) => Promise<void>;
  onDeleteTrack: (track: Track) => Promise<void>;
  onEditTrack: (track: Track, input: LocalTrackUpdateInput) => Promise<void>;
  onImportPreset: (
    options: PresetImportOptions,
    onProgress?: (progress: PresetImportProgress) => void,
  ) => Promise<void>;
  onInfoOpen: () => void;
};

export default function TopbarActions({
  tracks,
  onAddTrack,
  onDeleteTrack,
  onEditTrack,
  onImportPreset,
  onInfoOpen,
}: TopbarActionsProps) {
  const { isEditing, toggleEditMode } = useEditMode();
  const [isTrackLibraryOpen, setIsTrackLibraryOpen] = useState(false);
  const EditIcon = isEditing ? CheckIcon : PencilIcon;

  return (
    <>
      <EditModeSwitch display={{ base: "none", sm: "inline-flex" }} />

      <IconButton
        Icon={EditIcon}
        aria-label={isEditing ? "Done editing" : "Edit mode"}
        display={{ base: "inline-flex", sm: "none" }}
        onClick={toggleEditMode}
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
        onImportPreset={onImportPreset}
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
