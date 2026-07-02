import { useEffect } from "react";

//------------------------------------------------------------------------------
// Use Global Hotkeys
//------------------------------------------------------------------------------

type UseGlobalHotkeysInput = {
  onEditToggle: () => void;
  onMasterMuteToggle: () => void;
  onPauseToggle: () => void;
  onSceneToggle: () => void;
  onTracksToggle: () => void;
};

export default function useGlobalHotkeys({
  onEditToggle,
  onMasterMuteToggle,
  onPauseToggle,
  onSceneToggle,
  onTracksToggle,
}: UseGlobalHotkeysInput) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreModifiedHotkey(event)) return;

      if (event.key === " ") {
        if (isInteractiveHotkeyTarget(event.target)) return;

        event.preventDefault();
        onPauseToggle();
        return;
      }

      const hotkey = event.key.toLowerCase();
      if (isEditableTextTarget(event.target)) return;

      if (hotkey === "e") {
        event.preventDefault();
        onEditToggle();
        return;
      }

      if (hotkey === "m") {
        event.preventDefault();
        onMasterMuteToggle();
        return;
      }

      if (hotkey === "p") {
        event.preventDefault();
        onPauseToggle();
        return;
      }

      if (hotkey === "s") {
        event.preventDefault();
        onSceneToggle();
        return;
      }

      if (hotkey === "t") {
        event.preventDefault();
        onTracksToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEditToggle, onMasterMuteToggle, onPauseToggle, onSceneToggle, onTracksToggle]);
}

//------------------------------------------------------------------------------
// Should Ignore Modified Hotkey
//------------------------------------------------------------------------------

function shouldIgnoreModifiedHotkey(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return true;
  if (event.defaultPrevented || event.repeat) return true;

  return false;
}

//------------------------------------------------------------------------------
// Is Interactive Hotkey Target
//------------------------------------------------------------------------------

function isInteractiveHotkeyTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return Boolean(
    target.closest(
      'button, input, select, textarea, [contenteditable="true"], [role="button"], [role="checkbox"], [role="combobox"], [role="menuitem"], [role="option"], [role="slider"], [role="switch"]',
    ),
  );
}

//------------------------------------------------------------------------------
// Is Editable Text Target
//------------------------------------------------------------------------------

function isEditableTextTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
}
