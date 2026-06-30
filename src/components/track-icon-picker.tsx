import { Box, Grid, Input, Popover, Portal } from "@chakra-ui/react";
import { useEffect, useState, type KeyboardEvent } from "react";

import { resolveTrackIcon } from "~/sound/tracks";
import DynamicIconButton from "~/ui/dynamic-icon-button";

import type { IconName } from "lucide-react/dynamic";

//------------------------------------------------------------------------------
// Track Icon Picker
//------------------------------------------------------------------------------

type TrackIconPickerProps = {
  label: string;
  value: string;
  onIconChange: (icon: string) => void;
};

const fallbackIcon = "music";
const presetIcons = [
  "music",
  "drum",
  "wind",
  "cloud-rain",
  "cloud",
  "waves",
  "flame",
  "swords",
  "shield",
  "skull",
  "castle",
  "tent",
  "trees",
  "mountain",
  "moon",
  "sun",
  "sparkles",
  "ship",
  "footprints",
  "zap",
] satisfies IconName[];

export default function TrackIconPicker({ label, value, onIconChange }: TrackIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customIcon, setCustomIcon] = useState(value);
  const selectedIcon = resolveTrackIcon(value) ?? fallbackIcon;

  useEffect(() => {
    setCustomIcon(value);
  }, [value]);

  //------------------------------------------------------------------------------
  // Select Icon
  //------------------------------------------------------------------------------

  const selectIcon = (icon: string) => {
    setCustomIcon(icon);
    onIconChange(icon);
    setIsOpen(false);
  };

  //------------------------------------------------------------------------------
  // Commit Custom Icon
  //------------------------------------------------------------------------------

  const commitCustomIcon = () => {
    const icon = customIcon.trim();
    if (!icon) return;

    onIconChange(icon);
  };

  //------------------------------------------------------------------------------
  // Handle Custom Icon Key Down
  //------------------------------------------------------------------------------

  const handleCustomIconKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    commitCustomIcon();
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <Popover.Trigger asChild>
        <DynamicIconButton
          aria-label={label}
          borderRadius="sm"
          icon={selectedIcon}
          minW={8}
          size="xs"
          variant="outline"
          w={8}
        />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content p={3} w="15rem">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Grid gap={2} templateColumns="repeat(5, 1fr)">
              {presetIcons.map((icon) => (
                <DynamicIconButton
                  key={icon}
                  aria-label={`Select ${icon}`}
                  icon={icon}
                  onClick={() => selectIcon(icon)}
                  size="xs"
                  variant={selectedIcon === icon ? "solid" : "outline"}
                />
              ))}
            </Grid>
            <Box mt={3}>
              <Input
                aria-label="Custom Lucide icon"
                onBlur={commitCustomIcon}
                onChange={(event) => setCustomIcon(event.currentTarget.value)}
                onKeyDown={handleCustomIconKeyDown}
                placeholder="Custom Lucide icon"
                size="xs"
                value={customIcon}
              />
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
