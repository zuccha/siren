import { useEffect } from "react";

//------------------------------------------------------------------------------
// Use Global Hotkeys
//------------------------------------------------------------------------------

type UseGlobalHotkeysInput = {
  onEditToggle: () => void;
  onPauseToggle: () => void;
};

export default function useGlobalHotkeys({ onEditToggle, onPauseToggle }: UseGlobalHotkeysInput) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreHotkey(event)) return;

      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        onEditToggle();
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        onPauseToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEditToggle, onPauseToggle]);
}

//------------------------------------------------------------------------------
// Should Ignore Hotkey
//------------------------------------------------------------------------------

function shouldIgnoreHotkey(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return true;
  if (event.defaultPrevented || event.repeat) return true;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  return ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
}
