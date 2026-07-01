import type { Track } from "./tracks";

//------------------------------------------------------------------------------
// Active Sound
//------------------------------------------------------------------------------

export type ActiveSound = {
  audio: HTMLAudioElement;
  baseVolume: number;
  isMasterMuted: boolean;
  isMuted: boolean;
  masterVolume: number;
  pausedBaseVolume?: number;
  pauseTimerId?: number;
  targetBaseVolume: number;
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
  options: {
    fadeIn?: boolean;
    isMasterMuted?: boolean;
    isMuted?: boolean;
    masterVolume?: number;
  } = {},
): ActiveSound {
  const audio = new Audio(track.src);
  const sound = {
    audio,
    baseVolume: options.fadeIn ? 0 : volume,
    isMasterMuted: options.isMasterMuted ?? false,
    isMuted: options.isMuted ?? false,
    masterVolume: options.masterVolume ?? 100,
    targetBaseVolume: volume,
  };

  audio.loop = true;
  audio.preload = "auto";
  audio.volume = getSoundVolume(sound);

  void audio.play();

  if (options.fadeIn) {
    fadeSoundTo(sound, volume, musicFadeDuration);
  }

  return sound;
}

//------------------------------------------------------------------------------
// Pause Sound
//------------------------------------------------------------------------------

export function pauseSound(sound: ActiveSound) {
  clearPauseTimer(sound);
  sound.audio.pause();
}

//------------------------------------------------------------------------------
// Fade Out And Pause
//------------------------------------------------------------------------------

export function fadeOutAndPause(sound: ActiveSound, duration = musicFadeDuration) {
  clearPauseTimer(sound);
  sound.pausedBaseVolume = sound.targetBaseVolume;
  fadeSoundTo(sound, 0, duration);
  sound.pauseTimerId = window.setTimeout(() => pauseSound(sound), duration * 1000);
}

//------------------------------------------------------------------------------
// Resume Sound
//------------------------------------------------------------------------------

export function resumeSound(sound: ActiveSound, options: { fadeIn?: boolean } = {}) {
  clearPauseTimer(sound);

  const volume = sound.pausedBaseVolume ?? sound.baseVolume;
  if (options.fadeIn) {
    sound.baseVolume = 0;
    sound.audio.volume = getSoundVolume(sound);
  }

  void sound.audio.play();

  if (options.fadeIn) {
    fadeSoundTo(sound, volume, musicFadeDuration);
  }

  sound.pausedBaseVolume = undefined;
}

//------------------------------------------------------------------------------
// Set Sound Master Volume
//------------------------------------------------------------------------------

export function setSoundMasterVolume(sound: ActiveSound, volume: number) {
  sound.masterVolume = volume;
  sound.audio.volume = getSoundVolume(sound);
}

//------------------------------------------------------------------------------
// Set Sound Master Muted
//------------------------------------------------------------------------------

export function setSoundMasterMuted(sound: ActiveSound, isMuted: boolean) {
  sound.isMasterMuted = isMuted;
  sound.audio.volume = getSoundVolume(sound);
}

//------------------------------------------------------------------------------
// Set Sound Muted
//------------------------------------------------------------------------------

export function setSoundMuted(sound: ActiveSound, isMuted: boolean) {
  sound.isMuted = isMuted;
  sound.audio.volume = getSoundVolume(sound);
}

//------------------------------------------------------------------------------
// Set Sound Base Volume
//------------------------------------------------------------------------------

export function setSoundBaseVolume(sound: ActiveSound, volume: number) {
  sound.baseVolume = volume;
  sound.targetBaseVolume = volume;
  if (sound.pausedBaseVolume !== undefined) sound.pausedBaseVolume = volume;
  sound.audio.volume = getSoundVolume(sound);
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
  sound.targetBaseVolume = volume;

  if (duration <= 0) {
    sound.baseVolume = volume;
    sound.audio.volume = getSoundVolume(sound);
    return;
  }

  const frameDuration = 16;
  const startVolume = sound.baseVolume;
  const startTime = performance.now();
  const durationMs = duration * 1000;

  sound.volumeTimerId = window.setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    sound.baseVolume = startVolume + (volume - startVolume) * progress;
    sound.audio.volume = getSoundVolume(sound);

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
  clearPauseTimer(sound);

  if (sound.stopTimerId) {
    window.clearTimeout(sound.stopTimerId);
    sound.stopTimerId = undefined;
  }
}

//------------------------------------------------------------------------------
// Clear Pause Timer
//------------------------------------------------------------------------------

function clearPauseTimer(sound: ActiveSound) {
  if (sound.pauseTimerId) {
    window.clearTimeout(sound.pauseTimerId);
    sound.pauseTimerId = undefined;
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

//------------------------------------------------------------------------------
// Get Sound Volume
//------------------------------------------------------------------------------

function getSoundVolume(sound: ActiveSound) {
  if (sound.isMuted || sound.isMasterMuted) return 0;
  return clampVolume((sound.baseVolume / 100) * (sound.masterVolume / 100));
}

//------------------------------------------------------------------------------
// Clamp Volume
//------------------------------------------------------------------------------

function clampVolume(volume: number) {
  return Math.min(Math.max(volume, 0), 1);
}
