import { createContext, useContext } from "react";

//------------------------------------------------------------------------------
// Edit Mode Context Value
//------------------------------------------------------------------------------

export type EditModeContextValue = {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  toggleEditMode: () => void;
};

//------------------------------------------------------------------------------
// Edit Mode Context
//------------------------------------------------------------------------------

export const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

//------------------------------------------------------------------------------
// Use Edit Mode
//------------------------------------------------------------------------------

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) throw new Error("useEditMode must be used inside EditModeProvider.");

  return context;
}
