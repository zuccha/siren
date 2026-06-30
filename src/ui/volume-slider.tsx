import { Slider, type SliderRootProps } from "@chakra-ui/react";

//------------------------------------------------------------------------------
// Volume Slider
//------------------------------------------------------------------------------

type VolumeSliderProps = Omit<
  SliderRootProps,
  "aria-label" | "children" | "onValueChange" | "value"
> & {
  "aria-label": string;
  "value": number;
  "onValueChange": (value: number) => void;
};

export default function VolumeSlider({
  "aria-label": ariaLabel,
  value,
  onValueChange,
  ...rest
}: VolumeSliderProps) {
  return (
    <Slider.Root
      aria-label={[ariaLabel]}
      flex="1"
      max={100}
      min={0}
      onValueChange={(details) => onValueChange(details.value[0] ?? 0)}
      size="sm"
      value={[value]}
      {...rest}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
  );
}
