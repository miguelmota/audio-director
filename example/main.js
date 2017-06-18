var AudioDirector = require('../')

var Player = AudioDirector.Player
var YoutubePlayer = AudioDirector.YoutubePlayer
var PlayerEventTypes = Player.EventTypes
var player = new Player()
//var player = new YoutubePlayer()

window.player = player

function logAudioBlob(blob, message) {
  return new Promise((resolve, reject) => {
    const a = document.createElement('a');
    const aDownload = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    const ext = blob.type.indexOf('mpeg') > -1 ? 'mp3' : 'wav';
    const filename = `${Date.now()}.${ext}`;
    a.href = url;
    a.target = '_blank';
    aDownload.href = url;
    a.textContent = filename;
    aDownload.download = filename;
    aDownload.textContent = `download`;

    audioLogOutput.innerHTML = `<li>${message}: ${a.outerHTML} ${aDownload.outerHTML}</li>` +audioLogOutput.innerHTML;
    resolve(blob);
  });
}

function getEl(selector) {
  return document.querySelector(selector)
}

const urlInput = getEl('#urlInput');
const urlInputSubmit = getEl('#urlInputSubmit');
const logOutput = getEl('#log');
const audioLogOutput = getEl('#audioLog');
const stopAudio = getEl('#stopAudio');
const pauseAudio = getEl('#pauseAudio');
const playAudio = getEl('#playAudio');
const replayAudio = getEl('#replayAudio');
const next = getEl('#next');
const previous = getEl('#previous');
const playbackRateSlider = getEl('#playbackRateSlider');
const volumeSlider = getEl('#volumeSlider');

player.on(PlayerEventTypes.LOG, log);
player.on(PlayerEventTypes.ERROR, logError);

player.on(PlayerEventTypes.PLAY, () => {
  playAudio.disabled = true;
  replayAudio.disabled = true;
  pauseAudio.disabled = false;
  stopAudio.disabled = false;
});

player.on(PlayerEventTypes.ENDED, () => {
  playAudio.disabled = true;
  replayAudio.disabled = false;
  pauseAudio.disabled = true;
  stopAudio.disabled = true;
});

player.on(PlayerEventTypes.STOP, () => {
  playAudio.disabled = true;
  replayAudio.disabled = false;
  pauseAudio.disabled = false;
  stopAudio.disabled = false;
});

player.on(PlayerEventTypes.PAUSE, () => {
  playAudio.disabled = false;
  replayAudio.disabled = false;
  pauseAudio.disabled = true;
  stopAudio.disabled = true;
});

player.on(PlayerEventTypes.REPLAY, () => {
  playAudio.disabled = true;
  replayAudio.disabled = true;
  pauseAudio.disabled = false;
  stopAudio.disabled = false;
});

player.on(PlayerEventTypes.ENQUEUE, () => {
  playAudio.disabled = false;
})

player.on(PlayerEventTypes.PLAYBACK_RATE, rate => {

})

player.on(PlayerEventTypes.VOLUME, volume => {

})

function log(message) {
  logOutput.innerHTML = `<li>LOG: ${message}</li>` + logOutput.innerHTML;
}

function logError(error) {
  logOutput.innerHTML = `<li>ERROR: ${error}</li>` + logOutput.innerHTML;
}


stopAudio.addEventListener('click', (event) => {
  player.stop();
});

pauseAudio.addEventListener('click', (event) => {
  player.pause();
});

playAudio.addEventListener('click', (event) => {
  player.play();
});

replayAudio.addEventListener('click', (event) => {
  player.replay();
});

next.addEventListener('click', (event) => {
  player.next()
  .then(() => player.play())
});

previous.addEventListener('click', (event) => {
  player.previous()
  .then(() => player.play())
});

urlInput.value = 'https://fanburst.com/stream/f9d20bbd-d94c-42e2-bc32-232fd418e422?client_id=51938de2-772a-449a-984c-35ca26f38078'

var url = urlInput.value

urlInputSubmit.addEventListener('click', event => {
  var url = urlInput.value

  player.emptyQueue()
  .then(() => {
    return player.enqueue(url)
  })
})

playbackRateSlider.addEventListener('input', event => {
  const rate = event.target.value

  player.setPlaybackRate(rate)
})

volumeSlider.addEventListener('input', event => {
  const volume = event.target.value

  player.setVolume(volume)
})

var one = 'http://api.soundcloud.com/tracks/325088081/stream?consumer_key=nH8p0jYOkoVEZgJukRlG6w'

var two = 'https://fanburst.com/stream/f9d20bbd-d94c-42e2-bc32-232fd418e422?client_id=51938de2-772a-449a-984c-35ca26f38078'

player.enqueue(one)
.then(() => player.enqueue(two))
.then(() => {
  console.log('queued')
})
.catch(error => {
  console.error(error)
})
