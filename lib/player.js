const EventEmitter = require('events')
const arrayBufferToAudioBuffer = require('arraybuffer-to-audiobuffer');
const {scaleLinear} = require('d3-scale')

const PlayerEventTypes = require('./constants/PlayerEventTypes')

const toString = Object.prototype.toString;

class Player extends EventEmitter {
  constructor() {
    super()

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    this._queue = []
    this._currentQueueIndex = 0
    this._currentSource = null
    this._currentBuffer = null
    this._context = new AudioContext()
    this._playbackRate = 1

    this._playbackRateScale = scaleLinear()
    .domain([0.75, 2])
    .range([0.75, 2])
    .clamp(true)

    this._volume = 1
    this._volumeScale = scaleLinear()
    .domain([0, 1])
    .range([0, 1])
    .clamp(true)

    this.isReady = true
    this._log('Player ready');
    this.emit(PlayerEventTypes.READY);
  }

  _log(type, message) {
    if (type && !message) {
      message = type;
      type = 'log';
    }

    setTimeout(() => {
      this.emit(PlayerEventTypes.LOG, message);
    }, 0);

    if (this._debug) {
      console[type](message);
    }
  }

  emptyQueue() {
    return new Promise((resolve, reject) => {
      this._queue = [];
      this._currentQueueIndex = 0
      this._audio = null;
      this._currentBuffer = null;
      this._currentSource = null;
      resolve();
    });
  }

  enqueue(item) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(item)) {
        return item.forEach(x => this.enqueue(x))
      }

      if (!item) {
        const error = new Error('argument cannot be empty.');
        this._log(error);
        return reject(error);
      }

      const stringType = toString.call(item).replace(/\[.*\s(\w+)\]/, '$1');

      const proceed = (audioBuffer) => {
        this._queue.push(audioBuffer);
        this._log('Enqueue audio');
        this.emit(PlayerEventTypes.ENQUEUE);
        return resolve(audioBuffer);
      };

      if (stringType === 'DataView' || stringType === 'Uint8Array') {
        return arrayBufferToAudioBuffer(item.buffer, this._context)
        .then(proceed);
      } else if (stringType === 'AudioBuffer') {
        return proceed(item);
      } else if (stringType === 'ArrayBuffer') {
        return arrayBufferToAudioBuffer(item, this._context)
        .then(proceed);
      } else if (stringType === 'String') {
        return proceed(item);
      } else {
        const error = new Error('Invalid type.');
        this.emit('error', error);
        return reject(error);
      }
    });
  }

  deque() {
    return new Promise((resolve, reject) => {
      const item = this._queue[this._currentQueueIndex]

      if (item) {
        this._log('Deque audio');
        this.emit(PlayerEventTypes.DEQUE);
        return resolve(item);
      }

      return reject(new Error('no item to play'));
    });
  }

  play() {
    return new Promise((resolve, reject) => {
      // if paused then resume
      if (this._context.state === 'suspended') {
        this._context.resume();

        this._log('Play audio');
        this.emit(PlayerEventTypes.PLAY);
        resolve();

      // if paused then resume
      } else if (this._audio && this._audio.paused) {
        this._log('Play audio');
        this.emit(PlayerEventTypes.PLAY);
        this._audio.play();
        resolve();

      // if paused then resume
      } else {
        return this.deque()
        .then(audioBuffer => {
          this._log('Play audio');
          this.emit(PlayerEventTypes.PLAY);
          if (typeof audioBuffer === 'string') {
            return this.playUrl(audioBuffer);
          }
          return this.playAudioBuffer(audioBuffer);
        }).then(resolve);
      }
    });
  }

  playQueue() {
    return this.play().then(() => {
      if (this._queue.length) {
        return this.playQueue();
      }
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
        if (this._currentSource) {
          this._currentSource.onended = function() {};
          this._currentSource.stop();
        }

        if (this._audio) {
          this._audio.onended = function() {};
          this._audio.currentTime = 0;
          this._audio.pause();
        }

        this._log('Stop audio');
        this.emit(PlayerEventTypes.STOP);
    });
  }

  pause() {
    return new Promise((resolve, reject) => {
        if (this._currentSource && this._context.state === 'running') {
          this._context.suspend();
        }

        if (this._audio) {
          this._audio.pause();
        }

        this._log('Pause audio');
        this.emit(PlayerEventTypes.PAUSE);
    });
  }

  replay() {
    return new Promise((resolve, reject) => {
        if (this._currentBuffer) {
          this._log('Replay audio');
          this.emit(PlayerEventTypes.REPLAY);

          if (this._context.state === 'suspended') {
            this._context.resume();
          }

          if (this._currentSource) {
            this._currentSource.stop();
            this._currentSource.onended = function() {};
          }
          return this.playAudioBuffer(this._currentBuffer);
        } else if (this._audio) {
          this._log('Replay audio');
          this.emit(PlayerEventTypes.REPLAY);
          return this.playUrl(this._audio.src);
        } else {
          const error = new Error('No audio source loaded.');
          this.emit('error', error)
          reject();
        }
    });
  }

  playBlob(blob) {
    return new Promise((resolve, reject) => {
      if (!blob) {
        reject();
      }

      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio();
      audio.src = objectUrl;
      this._currentBuffer = null;
      this._currentSource = null;
      this._audio = audio;
      this._audio.playbackRate = this._playbackRate

      audio.onended = () => {
        this._log('Audio ended');
        this.emit(PlayerEventTypes.ENDED);
        resolve();
      };

      audio.onerror = (error) => {
        this.emit('error', error);
        reject(error);
      };

      audio.onload = (event) => {
        URL.revokeObjectUrl(objectUrl);
      };

      audio.play();
    });
  }

  playAudioBuffer(buffer) {
    return new Promise((resolve, reject) => {
      if (!buffer) {
        reject();
      }

      const source = this._context.createBufferSource();
      source.buffer = buffer;
      source.connect(this._context.destination);
      source.start(0);
      this._currentBuffer = buffer;
      this._currentSource = source;
      this._audio = null;

      source.onended = (event) => {
        this._log('Audio ended');
        this.emit(PlayerEventTypes.ENDED);
        resolve();
      };

      source.onerror = (error) => {
        this.emit('error', error);
        reject(error);
      };
    });
  }

  playUrl(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = url;
      this._currentBuffer = null;
      this._currentSource = null;
      this._audio = audio;
      this._audio.playbackRate = this._playbackRate

      audio.onended = (event) => {
        this._log('Audio ended');
        this.emit(PlayerEventTypes.ENDED);
        resolve();
      };

      audio.onerror = (error) => {
        this.emit('error', error);
        reject(error);
      };

      audio.play();
    });
  }

  next() {
    return new Promise((resolve, reject) => {
      const item = this._queue[this._currentQueueIndex + 1]

      if (item) {
        this._currentQueueIndex++

        this._log('Next audio');
        this.emit(PlayerEventTypes.NEXT);

        this.stop()
        this._audio = null
        return resolve(item)
      }

      return reject(new Error('no item to play'));
    });
  }

  previous() {
    return new Promise((resolve, reject) => {
      const item = this._queue[this._currentQueueIndex - 1]

      if (item) {
        this._currentQueueIndex--
        this._log('Previous audio');
        this.emit(PlayerEventTypes.PREVIOUS);

        this.stop()
        this._audio = null
        return resolve(item)
      }

      return reject(new Error('no item to play'));
    });
  }

  setPlaybackRate(rate) {
    return new Promise((resolve, reject) => {
      this._playbackRate = this._playbackRateScale(rate)

      if (this._audio) {
        this._audio.playbackRate = this._playbackRate;
      }

      this._log(`Set playback rate: ${this._playbackRate}`);
      this.emit(PlayerEventTypes.PLAYBACK_RATE, this._playbackRate);

      resolve(this._playbackRate)
    })
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      this._volume = this._volumeScale(volume)

      if (this._audio) {
        this._audio.volume = this._volume;
      }

      this._log(`Set volume: ${this._volume}`);
      this.emit(PlayerEventTypes.VOLUME, this._volume);

      resolve(this._volume)
    })
  }

  static get EventTypes() {
    return PlayerEventTypes
  }
}

module.exports = Player
