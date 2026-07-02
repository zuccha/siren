import { type ReactNode, useCallback, useMemo, useState } from "react";

import { EditModeContext } from "./edit-mode";

//------------------------------------------------------------------------------
// Edit Mode Provider
//------------------------------------------------------------------------------

type EditModeProviderProps = {
  children: ReactNode;
};

export default function EditModeProvider({ children }: EditModeProviderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditMode = useCallback(() => setIsEditing((current) => !current), []);
  const value = useMemo(
    () => ({ isEditing, setIsEditing, toggleEditMode }),
    [isEditing, toggleEditMode],
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
