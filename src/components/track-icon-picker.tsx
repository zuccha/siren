import { Grid, Popover, Portal, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { resolveTrackIcon, type TrackIconName } from "~/sound/track-icons";
import TrackIconButton from "~/ui/track-icon-button";

//------------------------------------------------------------------------------
// Track Icon Picker
//------------------------------------------------------------------------------

type TrackIconPickerProps = {
  label: string;
  size?: TrackIconPickerSize;
  value: string;
  onIconChange: (icon: string) => void;
};

type TrackIconPickerSize = "lg" | "md" | "sm" | "xs";
type TrackIconButtonSize = "lg" | "md" | "sm" | "xs";

const buttonSizeByPickerSize: Record<TrackIconPickerSize, TrackIconButtonSize> = {
  lg: "lg",
  md: "md",
  sm: "sm",
  xs: "xs",
};

const iconButtonSizeByPickerSize: Record<TrackIconPickerSize, number> = {
  lg: 12,
  md: 10,
  sm: 8,
  xs: 8,
};

const fallbackIcon = "music";
const iconGroups = [
  {
    label: "Mood",
    icons: ["music", "party-popper", "ghost", "skull", "eye", "smile", "frown", "heart"],
  },
  {
    label: "Objects",
    icons: [
      "sword",
      "swords",
      "shield",
      "anvil",
      "bell",
      "trophy",
      "crown",
      "gem",
      "compass",
      "scale",
      "hourglass",
      "telescope",
      "flask-conical",
      "wand",
      "scroll",
      "book-open",
      "anchor",
      "drama",
      "palette",
      "beer",
      "utensils",
      "footprints",
      "paw-print",
      "feather",
    ],
  },
  {
    label: "Buildings & Places",
    icons: ["house", "store", "school", "hospital", "church", "castle", "tent", "flame-kindling"],
  },
  {
    label: "Weather & Nature",
    icons: [
      "cloud",
      "cloud-rain-wind",
      "wind",
      "waves",
      "waves-vertical",
      "leaf",
      "tree-pine",
      "trees",
      "mountain",
      "sun",
      "moon",
      "star",
      "flame",
      "snowflake",
      "droplet",
      "zap",
    ],
  },
  {
    label: "Animals",
    icons: ["cat", "rabbit", "rat", "squirrel", "bird", "snail", "bug", "fish"],
  },
] satisfies { label: string; icons: TrackIconName[] }[];

export default function TrackIconPicker({
  label,
  size = "md",
  value,
  onIconChange,
}: TrackIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIcon = resolveTrackIcon(value) ?? fallbackIcon;
  const buttonSize = buttonSizeByPickerSize[size];
  const iconButtonSize = iconButtonSizeByPickerSize[size];

  //------------------------------------------------------------------------------
  // Select Icon
  //------------------------------------------------------------------------------

  const selectIcon = (icon: string) => {
    onIconChange(icon);
    setIsOpen(false);
  };

  return (
    <Popover.Root
      lazyMount
      open={isOpen}
      unmountOnExit
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <Popover.Trigger asChild>
        <TrackIconButton
          aria-label={label}
          icon={selectedIcon}
          minW={iconButtonSize}
          size={buttonSize}
          variant="outline"
          w={iconButtonSize}
        />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="calc(100vw - 2rem)" p={3} w="22rem">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Stack gap={3} overflowY="auto" pr={1}>
              {iconGroups.map((group) => (
                <Stack key={group.label} gap={1}>
                  <Text fontSize="xs" fontWeight="medium">
                    {group.label}
                  </Text>
                  <Grid gap={2} templateColumns="repeat(auto-fill, minmax(2rem, 1fr))">
                    {group.icons.map((icon) => (
                      <TrackIconButton
                        key={icon}
                        aria-label={`Select ${icon}`}
                        icon={icon}
                        onClick={() => selectIcon(icon)}
                        size="xs"
                        variant={selectedIcon === icon ? "solid" : "outline"}
                      />
                    ))}
                  </Grid>
                </Stack>
              ))}
            </Stack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
