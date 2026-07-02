import {
  AnchorIcon,
  BeerIcon,
  BellIcon,
  BirdIcon,
  BookOpenIcon,
  BugIcon,
  CatIcon,
  CastleIcon,
  ChurchIcon,
  CloudRainWindIcon,
  CompassIcon,
  CrownIcon,
  DropletIcon,
  DramaIcon,
  EyeIcon,
  FeatherIcon,
  FishIcon,
  FlameIcon,
  FlameKindlingIcon,
  FlaskConicalIcon,
  FootprintsIcon,
  FrownIcon,
  GemIcon,
  GhostIcon,
  HeartIcon,
  HouseIcon,
  HourglassIcon,
  LeafIcon,
  MoonIcon,
  MountainIcon,
  MusicIcon,
  PaletteIcon,
  PawPrintIcon,
  RabbitIcon,
  RatIcon,
  ScrollIcon,
  ScaleIcon,
  ShieldIcon,
  SkullIcon,
  SmileIcon,
  SnailIcon,
  SnowflakeIcon,
  SquirrelIcon,
  StarIcon,
  StoreIcon,
  SunIcon,
  SwordIcon,
  SwordsIcon,
  TentIcon,
  TreePineIcon,
  TreesIcon,
  TrophyIcon,
  WandIcon,
  WavesIcon,
  WavesVerticalIcon,
  WindIcon,
  ZapIcon,
  type LucideIcon,
  PartyPopperIcon,
  CloudIcon,
  TelescopeIcon,
  SchoolIcon,
  HospitalIcon,
  UtensilsIcon,
  AnvilIcon,
} from "lucide-react";

//------------------------------------------------------------------------------
// Track Icon Components
//------------------------------------------------------------------------------

export const trackIconComponents = {
  "anchor": AnchorIcon,
  "anvil": AnvilIcon,
  "beer": BeerIcon,
  "bell": BellIcon,
  "bird": BirdIcon,
  "book-open": BookOpenIcon,
  "bug": BugIcon,
  "cat": CatIcon,
  "castle": CastleIcon,
  "church": ChurchIcon,
  "cloud": CloudIcon,
  "cloud-rain-wind": CloudRainWindIcon,
  "compass": CompassIcon,
  "crown": CrownIcon,
  "droplet": DropletIcon,
  "drama": DramaIcon,
  "eye": EyeIcon,
  "feather": FeatherIcon,
  "fish": FishIcon,
  "flame": FlameIcon,
  "flame-kindling": FlameKindlingIcon,
  "flask-conical": FlaskConicalIcon,
  "footprints": FootprintsIcon,
  "frown": FrownIcon,
  "gem": GemIcon,
  "ghost": GhostIcon,
  "heart": HeartIcon,
  "hospital": HospitalIcon,
  "house": HouseIcon,
  "hourglass": HourglassIcon,
  "leaf": LeafIcon,
  "moon": MoonIcon,
  "mountain": MountainIcon,
  "music": MusicIcon,
  "palette": PaletteIcon,
  "party-popper": PartyPopperIcon,
  "paw-print": PawPrintIcon,
  "rabbit": RabbitIcon,
  "rat": RatIcon,
  "scroll": ScrollIcon,
  "scale": ScaleIcon,
  "school": SchoolIcon,
  "shield": ShieldIcon,
  "skull": SkullIcon,
  "smile": SmileIcon,
  "snail": SnailIcon,
  "snowflake": SnowflakeIcon,
  "squirrel": SquirrelIcon,
  "star": StarIcon,
  "store": StoreIcon,
  "sun": SunIcon,
  "sword": SwordIcon,
  "swords": SwordsIcon,
  "telescope": TelescopeIcon,
  "tent": TentIcon,
  "tree-pine": TreePineIcon,
  "trees": TreesIcon,
  "trophy": TrophyIcon,
  "utensils": UtensilsIcon,
  "wand": WandIcon,
  "waves": WavesIcon,
  "waves-vertical": WavesVerticalIcon,
  "wind": WindIcon,
  "zap": ZapIcon,
} satisfies Record<string, LucideIcon>;

//------------------------------------------------------------------------------
// Track Icon Name
//------------------------------------------------------------------------------

export type TrackIconName = keyof typeof trackIconComponents;

//------------------------------------------------------------------------------
// Track Icon Names
//------------------------------------------------------------------------------

export const trackIconNames = Object.keys(trackIconComponents) as TrackIconName[];

//------------------------------------------------------------------------------
// Resolve Track Icon
//------------------------------------------------------------------------------

export function resolveTrackIcon(icon: string): TrackIconName | undefined {
  const candidates = [normalizeTrackIconName(icon), toKebabCase(icon)];
  return candidates.find(isTrackIconName);
}

//------------------------------------------------------------------------------
// Get Track Icon Component
//------------------------------------------------------------------------------

export function getTrackIconComponent(icon: TrackIconName) {
  return trackIconComponents[icon];
}

//------------------------------------------------------------------------------
// Normalize Track Icon Name
//------------------------------------------------------------------------------

function normalizeTrackIconName(icon: string) {
  return icon.trim().replace(/Icon$/, "");
}

//------------------------------------------------------------------------------
// Is Track Icon Name
//------------------------------------------------------------------------------

function isTrackIconName(icon: string): icon is TrackIconName {
  return icon in trackIconComponents;
}

//------------------------------------------------------------------------------
// To Kebab Case
//------------------------------------------------------------------------------

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
