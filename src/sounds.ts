const AudioContext =
  window.AudioContext || ((window as any).webkitAudioContext as AudioContext);
const audioContext = new AudioContext();
const soundNames = ["game-over", "jump", "level-up"];
const soundBuffers: Record<string, AudioBuffer> = {};
let SOUNDS_LOADED = false;

loadSounds().catch(console.error);

export function playSound(name: string) {
  if (SOUNDS_LOADED) {
    audioContext.resume();
    playBuffer(soundBuffers[name]);
  }
}

async function loadSounds() {
  await Promise.all(
    soundNames.map(async (soundName) => {
      soundBuffers[soundName] = await loadBuffer(`/${soundName}.mp3`);
    })
  );

  SOUNDS_LOADED = true;
}

function loadBuffer(filepath: string): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("GET", filepath);
    request.responseType = "arraybuffer";
    request.onload = () =>
      audioContext.decodeAudioData(request.response, resolve);
    request.onerror = reject;
    request.send();
  });
}

function playBuffer(buffer: AudioBuffer) {
  const source = audioContext.createBufferSource();

  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}
