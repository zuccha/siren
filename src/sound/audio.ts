import type { Track } from "./tracks";

//------------------------------------------------------------------------------
// Active Sound
//------------------------------------------------------------------------------

export type ActiveSound = {
  context: AudioContext;
  output: GainNode;
  nodes: AudioNode[];
  sources: Array<AudioBufferSourceNode | OscillatorNode>;
};

//------------------------------------------------------------------------------
// Create Noise Buffer
//------------------------------------------------------------------------------

function createNoiseBuffer(context: AudioContext, seconds: number) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

//------------------------------------------------------------------------------
// Connect Nodes
//------------------------------------------------------------------------------

function connectNodes(nodes: AudioNode[]) {
  for (let index = 0; index < nodes.length - 1; index += 1) {
    nodes[index]?.connect(nodes[index + 1]!);
  }
}

//------------------------------------------------------------------------------
// Start Tone
//------------------------------------------------------------------------------

function startTone(
  context: AudioContext,
  frequency: number,
  type: OscillatorType,
  output: AudioNode,
) {
  const oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  oscillator.connect(output);
  oscillator.start();

  return oscillator;
}

//------------------------------------------------------------------------------
// Start Noise
//------------------------------------------------------------------------------

function startNoise(context: AudioContext, output: AudioNode, seconds = 2) {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context, seconds);
  source.loop = true;
  source.connect(output);
  source.start();

  return source;
}

//------------------------------------------------------------------------------
// Create Sound
//------------------------------------------------------------------------------

export function createSound(track: Track, volume: number): ActiveSound {
  const context = new AudioContext();
  const output = context.createGain();
  output.gain.value = volume / 100;
  output.connect(context.destination);

  const nodes: AudioNode[] = [output];
  const sources: Array<AudioBufferSourceNode | OscillatorNode> = [];

  if (track.id === "calm") {
    const pad = context.createGain();
    pad.gain.value = 0.18;
    pad.connect(output);
    sources.push(startTone(context, 130.81, "sine", pad));
    sources.push(startTone(context, 196, "sine", pad));
    sources.push(startTone(context, 261.63, "triangle", pad));
    nodes.push(pad);
  }

  if (track.id === "action") {
    const pulse = context.createGain();
    pulse.gain.value = 0.14;
    pulse.connect(output);
    sources.push(startTone(context, 220, "square", pulse));
    sources.push(startTone(context, 329.63, "triangle", pulse));
    sources.push(startTone(context, 440, "sawtooth", pulse));
    nodes.push(pulse);
  }

  if (track.id === "combat") {
    const drone = context.createGain();
    drone.gain.value = 0.16;
    drone.connect(output);
    sources.push(startTone(context, 82.41, "sawtooth", drone));
    sources.push(startTone(context, 123.47, "triangle", drone));
    sources.push(startTone(context, 164.81, "sawtooth", drone));
    nodes.push(drone);
  }

  if (track.id === "rain") {
    const highPass = context.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 1300;

    const rainGain = context.createGain();
    rainGain.gain.value = 0.34;
    connectNodes([highPass, rainGain, output]);
    sources.push(startNoise(context, highPass, 3));
    nodes.push(highPass, rainGain);
  }

  if (track.id === "wind") {
    const lowPass = context.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.value = 620;
    lowPass.Q.value = 1.8;

    const windGain = context.createGain();
    windGain.gain.value = 0.44;
    connectNodes([lowPass, windGain, output]);
    sources.push(startNoise(context, lowPass, 4));
    nodes.push(lowPass, windGain);
  }

  if (track.id === "forest") {
    const chirpGain = context.createGain();
    chirpGain.gain.value = 0.06;
    chirpGain.connect(output);
    sources.push(startTone(context, 2489.02, "sine", chirpGain));
    sources.push(startTone(context, 3135.96, "triangle", chirpGain));
    nodes.push(chirpGain);
  }

  return { context, output, nodes, sources };
}

//------------------------------------------------------------------------------
// Stop Sound
//------------------------------------------------------------------------------

export function stopSound(sound: ActiveSound) {
  for (const source of sound.sources) {
    source.stop();
    source.disconnect();
  }

  for (const node of sound.nodes) {
    node.disconnect();
  }

  void sound.context.close();
}
