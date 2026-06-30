import type { Track } from "./tracks";

//------------------------------------------------------------------------------
// Active Sound
//------------------------------------------------------------------------------

export type ActiveSound = {
  audio: HTMLAudioElement;
  stopTimerId?: number;
  volumeTimerId?: number;
};

export const musicFadeDuration = 1.8;

//------------------------------------------------------------------------------
// Create Sound
//------------------------------------------------------------------------------

export function createSound(
  track: Track,
  volume: number,
  options: { fadeIn?: boolean } = {},
): ActiveSound {
  const audio = new Audio(track.src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = options.fadeIn ? 0 : volume / 100;

  const sound = { audio };

  void audio.play();

  if (options.fadeIn) {
    fadeSoundTo(sound, volume, musicFadeDuration);
  }

  return sound;
}

//------------------------------------------------------------------------------
// Stop Sound
//------------------------------------------------------------------------------

export function stopSound(sound: ActiveSound) {
  clearSoundTimers(sound);
  sound.audio.pause();
  sound.audio.currentTime = 0;
  sound.audio.src = "";
}

//------------------------------------------------------------------------------
// Fade Sound To
//------------------------------------------------------------------------------

export function fadeSoundTo(sound: ActiveSound, volume: number, duration = musicFadeDuration) {
  clearVolumeTimer(sound);

  const frameDuration = 16;
  const startVolume = sound.audio.volume;
  const targetVolume = volume / 100;
  const startTime = performance.now();
  const durationMs = duration * 1000;

  sound.volumeTimerId = window.setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    sound.audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (progress >= 1) {
      clearVolumeTimer(sound);
    }
  }, frameDuration);
}

//------------------------------------------------------------------------------
// Fade Out And Stop
//------------------------------------------------------------------------------

export function fadeOutAndStop(sound: ActiveSound, duration = musicFadeDuration) {
  fadeSoundTo(sound, 0, duration);
  sound.stopTimerId = window.setTimeout(() => stopSound(sound), duration * 1000);
}

//------------------------------------------------------------------------------
// Clear Sound Timers
//------------------------------------------------------------------------------

function clearSoundTimers(sound: ActiveSound) {
  clearVolumeTimer(sound);

  if (sound.stopTimerId) {
    window.clearTimeout(sound.stopTimerId);
    sound.stopTimerId = undefined;
  }
}

//------------------------------------------------------------------------------
// Clear Volume Timer
//------------------------------------------------------------------------------

function clearVolumeTimer(sound: ActiveSound) {
  if (sound.volumeTimerId) {
    window.clearInterval(sound.volumeTimerId);
    sound.volumeTimerId = undefined;
  }
}
