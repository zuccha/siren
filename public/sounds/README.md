# Sound files

Put audio files under this folder and list them in `tracks.json`.

Example paths:

- `public/sounds/ambience/calm.mp3` is served as `/sounds/ambience/calm.mp3`
- `public/sounds/environment/rain.mp3` is served as `/sounds/environment/rain.mp3`

The app reads `public/sounds/tracks.json` at startup. Browsers cannot list a folder directly, so every track must be listed in that JSON file.
