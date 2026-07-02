import { CheckIcon, PencilIcon } from "lucide-react";

import { useEditMode } from "~/edit-mode";

import Button, { type ButtonProps } from "./button";

//------------------------------------------------------------------------------
// Edit Mode Switch
//------------------------------------------------------------------------------

type EditModeSwitchProps = Omit<ButtonProps, "children" | "onClick" | "variant">;

export default function EditModeSwitch({ ...rest }: EditModeSwitchProps) {
  const { isEditing, toggleEditMode } = useEditMode();
  const Icon = isEditing ? CheckIcon : PencilIcon;

  return (
    <Button onClick={toggleEditMode} size="sm" variant={isEditing ? "solid" : "outline"} {...rest}>
      <Icon />
      {isEditing ? "Done" : "Edit"}
    </Button>
  );
}
