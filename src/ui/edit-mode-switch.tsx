import { Switch, type SwitchRootProps } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// Edit Mode Switch
//------------------------------------------------------------------------------

type EditModeSwitchProps = Omit<SwitchRootProps, "checked" | "children" | "onCheckedChange"> & {
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
};

export default function EditModeSwitch({
  isEditing,
  onEditingChange,
  ...rest
}: EditModeSwitchProps) {
  return (
    <Switch.Root
      checked={isEditing}
      onCheckedChange={(details) => onEditingChange(details.checked)}
      size="sm"
      {...rest}
    >
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Edit</Switch.Label>
    </Switch.Root>
  );
}
