const settings = {
  detune: 0,
  loop: false,
  loopStart: 0,
  loopEnd: 100,
  playbackRate: 1,
};

export class Sound {
  private static readonly audioContext = new AudioContext();

  private buffer?: AudioBuffer = undefined;
  private bufferSource?: AudioBufferSourceNode = undefined;

  constructor(path: string) {
    fetch(path)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        Sound.audioContext.decodeAudioData(buffer, decoded => {
          this.buffer = decoded;
        });
      });
  }

  play() {
    // Check if context is in suspended state (autoplay policy)
    if (Sound.audioContext.state === 'suspended') {
      Sound.audioContext.resume();
    }

    if (!this.buffer) return;

    this.stop();

    // Create a new AudioBufferSourceNode.
    this.bufferSource = Sound.audioContext.createBufferSource();

    // Set the buffer to the appropriate index.
    this.bufferSource.buffer = this.buffer;

    // Connect the buffer node to the destination.
    this.bufferSource.connect(Sound.audioContext.destination);

    // Set the detune value.
    this.bufferSource.detune.setValueAtTime(
      settings.detune,
      Sound.audioContext.currentTime
    );

    // Set whether or not the node loops.
    this.bufferSource.loop = settings.loop;

    // Set loop start and end.
    this.bufferSource.loopStart = settings.loopStart;
    this.bufferSource.loopEnd = settings.loopEnd;

    // Set playback rate.
    this.bufferSource.playbackRate.setValueAtTime(
      settings.playbackRate,
      Sound.audioContext.currentTime
    );

    // Start playing the sound.
    this.bufferSource.start(0, 0);
  }

  stop() {
    this.bufferSource?.stop();
  }

  changePlaybackRate(playbackRate: number) {
    if (!this.bufferSource) return;

    settings.playbackRate = Math.pow(10, playbackRate / 100);
    this.bufferSource.playbackRate.setValueAtTime(
      settings.playbackRate,
      Sound.audioContext.currentTime
    );
  }
  changeDetune(detune: number) {
    settings.detune = detune;
    this.bufferSource?.detune.setValueAtTime(
      detune,
      Sound.audioContext.currentTime
    );
  }

  toggleLoop() {
    if (!this.bufferSource) return;

    settings.loop = !settings.loop;
    this.bufferSource.loop = settings.loop;
  }

  changeLoopStart(loopStart: number) {
    if (!this.bufferSource) return;

    settings.loopStart = loopStart / 1000;
    this.bufferSource.loopStart = loopStart;
  }

  changeLoopEnd(loopEnd: number) {
    if (!this.bufferSource) return;

    settings.loopEnd = loopEnd / 1000;
    this.bufferSource.loopEnd = loopEnd;
  }
}
