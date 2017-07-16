const eventTypes = {
  LOG: 'log',
  ERROR: 'error',
  READY: 'ready',
  PLAY: 'play',
  REPLAY: 'replay',
  PAUSE: 'pause',
  STOP: 'pause',
  NEXT: 'next',
  PREVIOUS: 'previous',
  RANDOM: 'random',
  REPEAT: 'repeat',
  PLAYBACK_RATE: 'playbackRate',
  VOLUME: 'volume',
  MAX_VOLUME: 'maxVolume',
  MUTED: 'muted',
  ENDED: 'ended',
  ENQUEUE: 'enqueue',
  DEQUE: 'deque',
  EMPTY_QUEUE: 'emptyQueue',
  STATE_CHANGE: 'stateChange'
}

module.exports = eventTypes
