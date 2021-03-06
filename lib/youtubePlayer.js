const EventEmitter2 = require('eventemitter2').EventEmitter2
const qs = require('qs')
const {scaleLinear} = require('d3-scale')

const PlayerEventTypes = require('./constants/PlayerEventTypes')

const ee = new EventEmitter2({
  wildcard: true
})

/**
 * Class reprensenting a YoutubePlayer
 * @namespace YoutubePlayer
 * @example
 * const player = new YoutubePlayer()
 */
class YoutubePlayer {
  /**
   * @desc Create a YoutubePlayer
   */
  constructor () {
    this.emit = ee.emit.bind(ee)

    /**
     * @method on
     * @memberof YoutubePlayer
     * @instance
     * @desc Listen for player events
     * @param {String} eventName - name of even
     * @param {Function} callback - called when the event occurs
     * @example
     * player.on(Player.EventTypes.PLAY, () => {
     *
     * })
     * @example
     * player.on(Player.EventTypes.PLAYBACK_RATE, () => {
     *
     * })
     */
    this.on = ee.on.bind(ee)

    this._player = null

    this._playbackRate = 1
    this._playbackRateScale = scaleLinear()
      .domain([0.75, 2])
      .range([0.75, 2])
      .clamp(true)

    this._volume = 100 // scaled
    this._maxVolume = 100 // scaled
    this._volumeScale = scaleLinear()
      .domain([0, 1])
      .range([0, this._maxVolume])
      .clamp(true)
    this._maxVolumeScale = scaleLinear()
      .domain([0, 1])
      .range([0, 100])
      .clamp(true)

    this._isApiReady = false
    this._isReady = false

    this.random = false
    this.repeat = false

    if (!window.onYouTubeIframeAPIReady) {
      const tag = document.createElement('script')

      tag.src = 'https://www.youtube.com/iframe_api'

      const firstScriptTag = document.getElementsByTagName('script')[0]

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = () => {
      this._onYoutubeApiReady()
    }

    // if already api loaded
    if (window.YT) {
      this._onYoutubeApiReady()
    }
  }

  _destroyPlayer () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.destroy) {
        this._player.destroy()
      }

      if (this._player) {
        this._playerEl.remove()
      }

      return resolve()
    })
  }

  _setPlayer (props) {
    if (!props) {
      props = {}
    }

    const {videoId, playlistId} = props

    return new Promise((resolve, reject) => {
      this._destroyPlayer()

      this._playerEl = document.createElement('div')
      this._playerEl.cssText = 'position:absolute;left:-1000px;bottom:-1000px;visibility:hidden;pointer-events:none'
      this._playerEl.id = `player_${Math.random() * 1e10 | 0}`
      document.body.appendChild(this._playerEl)

      if (window.YT) {
        this._player = new window.YT.Player(this._playerEl.id, {
          height: 1,
          width: 1,
          events: {
            onReady: this._onPlayerReady.bind(this),
            onStateChange: this._onPlayerStateChange.bind(this)
          },
          videoId: videoId,
          playerVars: {
            listType: 'playlist',
            list: playlistId
          }
        })
      }
    })
  }

  _onYoutubeApiReady () {
    this._isApiReady = true
  }

  _onPlayerReady (event) {
    this.setPlaybackRate(this._playbackRate)
    this.setVolume(this._volume)

    this._isReady = true
    this._log('Player ready')
    this.emit(PlayerEventTypes.READY)
  }

  _onPlayerStateChange (event) {
    this._log(`Player state change: ${event.data}`)
    this.emit(PlayerEventTypes.STATE_CHANGE, event.data)
  }

  _log (type, message) {
    if (type && !message) {
      message = type
      type = 'log'
    }

    setTimeout(() => {
      this.emit(PlayerEventTypes.LOG, message)
    }, 0)

    if (this._debug) {
      console[type](message)
    }
  }

  /**
   * isReady
   * @desc Returns true if player is ready
   * @return {Boolean}
   * @example
   * const isReady = player.isReady()
   */
  isReady () {
    return this._isReady
  }

  /**
   * getCurrentUrl
   * @desc Get currently playing YouTube video url
   * @return {String}
   * @example
   * const url = player.getCurrentUrl()
   */
  getCurrentUrl () {
    if (this._player && this._player.getVideoUrl) {
      return this._player.getVideoUrl()
    }

    return null
  }

  /**
   * emptyQueue
   * @desc Empties queue
   * @return {Promise}
   * @example
   * player.emptyQueue()
   */
  emptyQueue () {
    return new Promise((resolve, reject) => {
      this.stop()

      this._log('Empty queue')
      this.emit(PlayerEventTypes.EMPTY_QUEUE)

      resolve()
    })
  }

  /**
   * enqueue
   * @desc Enqueue a YouTube url to play
   * @param {String} url - a YouTube url
   * @return {Promise}
   * @example
   * const url = 'https://www.youtube.com/watch?v=qk1nnAHI1mI'
   *
   * player.enqueue(url)
   */
  enqueue (url) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(url)) {
        url = url[0]
      }

      const query = qs.parse(url.replace(/.*\?/gi, ''))
      const videoId = query.v
      const playlistId = query.list

      if (!videoId) {
        return reject(new Error('videoId not found'))
      }

      this._log('Enqueue audio')
      this.emit(PlayerEventTypes.ENQUEUE)

      if (this._isApiReady) {
        return this._setPlayer({
          videoId,
          playlistId
        })
      } else {
        setTimeout(() => {
          this._setPlayer({
            videoId,
            playlistId
          })
            .then(() => resolve())
            .catch(() => reject(new Error('error')))
        }, 1e3)
      }
    })
  }

  /**
   * deqeue
   * @desc Deques an YouTube video from queue
   * @return {Promise}
   * @example
   * player.deque()
   */
  deque () {
    return new Promise((resolve, reject) => {
      this.next()

      this._log('Deque audio')
      this.emit(PlayerEventTypes.DEQUE)
      resolve()
    })
  }

  /**
   * play
   * @desc Plays current YouTube video in queue
   * @return {Promise}
   * @example
   * player.play()
   */
  play () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.playVideo) {
        this._player.playVideo()

        this._log('Play audio')
        this.emit(PlayerEventTypes.PLAY)
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  /**
   * playQueue
   * @desc Start playing YouTube video in queue
   * @return {Promise}
   * @example
   * player.playQueue()
   */
  playQueue () {
    return this.play()
  }

  /**
   * stop
   * @desc Stop playing current YouTube video
   * @return {Promise}
   * @example
   * player.stop()
   */
  stop () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.stopVideo) {
        this._player.stopVideo()
      }

      this._log('Stop audio')
      this.emit(PlayerEventTypes.STOP)
      resolve()
    })
  }

  /**
   * pause
   * @desc Pause playing current YouTube video
   * @return {Promise}
   * @example
   * player.pause()
   */
  pause () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.pauseVideo) {
        this._player.pauseVideo()
      }

      this._log('Pause audio')
      this.emit(PlayerEventTypes.PAUSE)
      resolve()
    })
  }

  /**
   * replay
   * @desc Replay current YouTube video
   * @return {Promise}
   * @example
   * player.replay()
   */
  replay () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.seekTo) {
        this._player.seekTo(0)
        this.play()

        this._log('Replay audio')
        this.emit(PlayerEventTypes.REPLAY)
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  /**
   * playUrl
   * @desc Play YouTube url
   * @param {String} url - YouTube url
   * @return {Promise}
   * @example
   * const url = 'https://www.youtube.com/watch?v=qk1nnAHI1mI'
   *
   * player.playUrl(url)
   */
  playUrl (url) {
    return this.emptyQueue()
      .then(() => {
        return this.enqueue(url)
      })
  }

  /**
   * next
   * @desc Play next YouTube video in queue
   * @return {Promise}
   * @example
   * player.next()
   */
  next () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.nextVideo) {
        this._player.nextVideo()

        this._log('Next audio')
        this.emit(PlayerEventTypes.NEXT)
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  /**
   * previous
   * @desc Play previous YouTube video in queue
   * @return {Promise}
   * @example
   * player.previous()
   */
  previous () {
    return new Promise((resolve, reject) => {
      if (this._player && this._player.previousVideo) {
        this._player.previousVideo()

        this._log('Previous audio')
        this.emit(PlayerEventTypes.PREVIOUS)
        resolve()
      } else {
        reject(new Error('player not ready'))
      }
    })
  }

  /**
   * setRandom
   * @desc Enable to disable random playback
   * @param {Boolean} enabled - boolean to enable random playback
   * @return {Promise}
   * @example
   * player.setRandom(true)
   */
  setRandom (enabled) {
    this.random = enabled
    this._log(`Set random: ${enabled}`)
    this.emit(PlayerEventTypes.RANDOM)
    return Promise.resolve(true)
  }

  /**
   * setRepeat
   * @desc Enable to disable repeat mode. Repeat mode replays the YouTube videos once the entire queue has finished playing.
   * @param {Boolean} enabled - boolean to enable repeat mode
   * @return {Promise}
   * @example
   * player.setRepeat(true)
   */
  setRepeat (enabled) {
    this.repeat = enabled
    this._log(`Set repeat: ${enabled}`)
    this.emit(PlayerEventTypes.REPEAT)
    return Promise.resolve(true)
  }

  /**
   * hasNext
   * @desc Return true if there's a YouTube video to play next in queue
   * @return {Boolean} hasNext
   * @example
   * const hasNext = player.hasNext()
   */
  hasNext () {
    // TODO
    return true
  }

  /**
   * hasPrevious
   * @desc Return true if there's a previous YouTube video in queue
   * @return {Boolean} hasPrevious
   * @example
   * const hasPrevious = player.hasPrevious()
   */
  hasPrevious () {
    // TODO
    return true
  }

  /**
   * setPlaybackRate
   * @desc Set the plaback rate speed, range 0.75-2
   * @param {Number} playbackRate - new playback rate
   * @return {Promise}
   * @example
   * player.setPlaybackRate(2)
   */
  setPlaybackRate (rate) {
    return new Promise((resolve, reject) => {
      this._playbackRate = this._playbackRateScale(rate)

      if (this._player && this._player.setPlaybackRate) {
        this._player.setPlaybackRate(this._playbackRate)
      }

      this._log(`Set playback rate: ${this._playbackRate}`)
      this.emit(PlayerEventTypes.PLAYBACK_RATE, this._playbackRate)
      resolve()
    })
  }

  /**
   * getPlaybackRate
   * @desc Get the current plaback rate speed
   * @return {Number} playback rate speed
   * @example
   * const playbackRate = player.getPlaybackRate()
   */
  getPlaybackRate () {
    return this._playbackRate
  }

  /**
   * setVolume
   * @desc Set volume, range 0-1
   * @param {Number} volume - volume value
   * @return {Promise}
   * @example
   * player.setVolume(0.9)
   */
  setVolume (volume) {
    return new Promise((resolve, reject) => {
      this._volume = this._volumeScale(volume)

      if (this._player && this._player.setVolume) {
        this._player.setVolume(this._volume)
      }

      this._log(`Set volume: ${this._volume}`)
      this.emit(PlayerEventTypes.VOLUME, this._volume)
      resolve()
    })
  }

  /**
   * getVolume
   * @desc Get current volume value
   * @return {Number} volume - current volume value
   * @example
   * player.getVolume()
   */
  getVolume () {
    return this._volume / 100
  }

  /**
   * setMaxVolume
   * @desc Set the maximum volume limit. For example if max volume is set to 0.6, then when volume is scaled from 0-0.6, meaning that volume level at 1 will play at 0.6
   * @param {Number} maxVolume - max volume, range 0-1
   * @return {Promise}
   * @example
   * player.setMaxVolume(0.8)
   */
  setMaxVolume (maxVolume) {
    return new Promise((resolve, reject) => {
      this._maxVolume = this._maxVolumeScale(maxVolume)
      this._volumeScale = scaleLinear()
        .domain([0, 1])
        .range([0, this._maxVolume])
        .clamp(true)

      this.setVolume(this._volume)

      this._log(`Set max volume: ${this._volume}`)
      this.emit(PlayerEventTypes.MAX_VOLUME, this._maxVolume)
      resolve()
    })
  }

  /**
   * getMaxVolume
   * @desc Get max volume value
   * @return {Number} maxVolume - max volume value
   * @example
   * player.getMaxVolume()
   */
  getMaxVolume () {
    return this._maxVolume / 100
  }

  /**
   * setMuted
   * @desc Set volume level to muted
   * @param {Boolean} enabled - boolean to enable mute
   * @return {Promise}
   * @example
   * player.setMuted(true)
   */
  // TODO
  setMuted (enabled) {
    this.muted = !!enabled

    return Promise.resolve(this.muted)
  }

  /**
   * getCurrentTime
   * @desc Return elapsed time in seconds since the YouTube video started playing
   * @return {Number} time - current time
   * @example
   * player.getCurrentTime()
   */
  getCurrentTime () {
    if (this._player && this._player.getCurrentTime) {
      return this._player.getCurrentTime()
    }

    return 0
  }

  /**
   * seekTo
   * @desc Seek to a specified time in YouTube video
   * @param {Number} seconds - number of seconds to seek to
   * @return {Promise}
   * @example
   * const seconds = 45
   *
   * player.seekTo(seconds)
   */
  seekTo (seconds) {
    if (this._player && this._player.seekTo) {
      return this._player.seekTo(seconds)
    }

    return Promise.resolve()
  }

  /**
   * getDuration
   * @desc Get duration of YouTube video
   * @return {Number} duration - duration of YouTube video
   * @example
   * player.getDuration()
   */
  getDuration () {
    if (this._player && this._player.getDuration) {
      return this._player.getDuration()
    }

    return 0
  }

  /**
   * getState
   * @desc Get current state of player
   * @return {String} - current state
   * @example
   * const currentState = player.getCurrentState()
   *
   * console.log(currentState) // 'playing'
   *
   */
  getCurrentState () {
    const states = {
      '-1': 'unstarted',
      '0': 'ended',
      '1': 'playing',
      '2': 'paused',
      '3': 'buffering',
      '5': 'video cued'
    }

    let state = 1

    if (this._player && this._player.getPlayerState) {
      state = this._player.getPlayerState()
    }

    return states[state]
  }

  /**
   * @static EventTypes
   * @type {Object}
   * @desc Return event types
   * @return {Object} eventTypes - all player event types
   * @example
   * const EventTypes = Player.EventTypes
   *
   * {
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
   * }
   */
  static get EventTypes () {
    return PlayerEventTypes
  }
}

module.exports = YoutubePlayer
