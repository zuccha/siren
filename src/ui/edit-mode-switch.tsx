import { CheckIcon, PencilIcon } from "lucide-react";

import Button, { type ButtonProps } from "./button";

//------------------------------------------------------------------------------
// Edit Mode Switch
//------------------------------------------------------------------------------

type EditModeSwitchProps = Omit<ButtonProps, "children" | "onClick" | "variant"> & {
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
};

export default function EditModeSwitch({
  isEditing,
  onEditingChange,
  ...rest
}: EditModeSwitchProps) {
  const Icon = isEditing ? CheckIcon : PencilIcon;

  return (
    <Button
      onClick={() => onEditingChange(!isEditing)}
      size="sm"
      variant={isEditing ? "solid" : "outline"}
      {...rest}
    >
      <Icon />
      {isEditing ? "Done" : "Edit"}
    </Button>
  );
}
