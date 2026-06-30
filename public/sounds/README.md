# Sound files

Tracks are added through the app. No hardcoded track manifest is loaded at startup.

Local tracks added through the app are stored only in the current browser:

- track metadata is stored in `localStorage`
- audio files are stored in IndexedDB
- no files are uploaded to a server
- clearing browser site data removes local tracks

Icons use Lucide icon names. These all work:

- Lucide names: `Castle`, `CloudLightning`, `Skull`, `Waves`, `TentTree`
- Lucide icon export names: `CastleIcon`, `CloudLightningIcon`, `SkullIcon`
- Kebab/snake names: `cloud-lightning`, `tent_tree`

Unknown icons fall back to `Music`.
