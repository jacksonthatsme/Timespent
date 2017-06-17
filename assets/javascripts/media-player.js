// Variables Manifest
// ================================

var mediaPlayer = $('[data-js="media-player"]'),
    mediaPlayerState = 'closed',
    minimizePlayerBtn = $('.js-media-player__actions__item--minimize'),
    expandPlayerBtn = $('.js-media-player__actions__item--expand'),
    closePlayerBtn = $('.js-media-player__action__item--close'),
    volumeIndicator = $('[data-js~="volume-indicator"]'),
    muteVideoBtn = $('[data-js~="mute-video"]'),
    preMuteValue,
    playVideoBtn = $('[data-js="play-video"]'),
    videoEl = $('#js-video-player__video')[0],
    playerSrcMp4 = $('#js-video-player__source--mp4'),
    playerSrcWebm = $('#js-video-player__video__source--webm'),
    videoStateCounterTotal = $('[data-js="video-state--counter__total"]'),
    videoStateCounterProgress = $('[data-js="video-state--counter__progress"]'),
    marqueeTitle = $('[data-js="media-player__marquee__title"]'),
    mediaPlayerVideoPlaceholder = $('[data-js="media-player__video__placeholder"]'),
    currentVideo,
    nextVideo,
    prevVideo,
    currentVideoId,
    videoItems = $('[data-js="video-item"]'),
    firstVideo = videoItems.eq(0);


// Document Ready
// ================================

$('document').ready(function(){


  // Init Volume Slider
  $('.js-media-player__slider').slider({
    min: 0,
    max: 1,
    value: 1,
    step: .1,
    slide: function(event, ui) {
      videoEl.volume = ui.value;

      if (ui.value >= .8) {
        setVolumeState('3');
      }
      else if (ui.value <= .8 && ui.value >= .4) {
        setVolumeState('2');
      }
      else if (ui.value <= .4 && ui.value >= .1) {
        setVolumeState('1');
      }
      else {
        setVolumeState('0');
      }
    },
    change: function(event, ui) {
      videoEl.volume = ui.value;

      if (ui.value >= .8) {
        setVolumeState('3');
      }
      else if (ui.value <= .8 && ui.value >= .4) {
        setVolumeState('2');
      }
      else if (ui.value <= .4 && ui.value >= .1) {
        setVolumeState('1');
      }
      else {
        setVolumeState('0');
      }
    }
  });

});


// Actions
// ================================

// Mute Video
muteVideoBtn.on('click', function(){
  if (videoEl.volume >= .1) {
    preMuteValue = videoEl.volume;
    videoEl.volume = 0;
    $('.js-media-player__slider').slider('value', 0);
  } else if (videoEl.volume <= .1) {
    videoEl.volume = preMuteValue
    $('.js-media-player__slider').slider('value', preMuteValue);
  }
});

// Video Play Button
playVideoBtn.on('click', function(){
  if (currentVideo === undefined) {
    changeVideo(firstVideo);
  }
  else {
    togglePlayState();
  }
});

// Launch Video
videoItems.on('click', function() {
  var $this = $(this);
  changeVideo($this);
  $("html, body").animate({ scrollTop: 0 }, 300);
});

// Next Video
$('.js-next-video').on('click', function() {
  changeVideo(nextVideo);
});

// Previous Video
$('.js-prev-video').on('click', function() {
  changeVideo(prevVideo);
});



// Methods
// ================================

function togglePlayState() {
  if (videoEl.paused == true) {
    // Play the video
    videoEl.play();
    setPlayState('play');
  } else {
    // Pause the video
    videoEl.pause();
    setPlayState('pause');
  }
}

function setVideoDuration() {
  var i = setInterval(function() {
    if(videoEl.readyState > 0) {
      var videoDuration = timeFormatted(videoEl.duration);
      videoStateCounterTotal.text(videoDuration);
      clearInterval(i);
    }
  }, 200);
}

// Set Video Play State
function setPlayState(state) {
  if (state == 'pause') {
    $('.js-media-player__play-state').removeClass('media-player__play-state--play').addClass('media-player__play-state--pause');
  } else if (state == 'play') {
    $('.js-media-player__play-state').removeClass('media-player__play-state--pause').addClass('media-player__play-state--play');
  }
}

// Set Volume
function setVolumeState(level) {
  volumeIndicator.removeClass('volume-indicator--3 volume-indicator--2 volume-indicator--1 volume-indicator--0').addClass('volume-indicator--'+level);
}

function setMarqueeTitle(video) {
  var updatedMarqueeTitle = video.data('marquee-title');
  marqueeTitle.text(updatedMarqueeTitle);
}

// Format Progress Time
function timeFormatted(timeNow) {
  var m = Math.floor(timeNow / 60);
  var s = Math.floor(timeNow % 60);
  if(s.toString().length<2){s='0'+s;}
  return m+':'+s
}

// Build Sources Array
function buildSource(video) {
  var srcMp4 = video.data("mp4-src");
  var srcWebm = video.data("webm-src");

  var builtSources = [srcMp4, srcWebm];
  return builtSources;
}

// Inject Sources Array into Video Player
function injectSource(source) {
  playerSrcMp4.attr('src', source[0]);
  playerSrcWebm.attr('src', source[1]);
}

// Hot Method: Change the Video Source
function changeVideo(video) {
  var source = buildSource(video);

  injectSource(source);

  setCurrentVideo(video);

  getStatus();
  setCurrentVideoActive();
  setPlayState('play');

  videoEl.load();
  videoEl.play();
  setVideoDuration();
  setMarqueeTitle(video);
  removePlaceholder();
}

function removePlaceholder() {
  mediaPlayerVideoPlaceholder.removeClass('visible');
}

function setCurrentVideoActive() {
  $('.video-item--active').find('[data-js="video-item__cta"]').text('played');
  $('.video-item--active').removeClass('video-item--active');
  currentVideo.addClass('video-item--active');
  currentVideo.find('[data-js="video-item__cta"]').text('playing');
}

function setCurrentVideo(video) {
  currentVideo = videoItems.filter(video);
  currentVideoId = videoItems.index(video);
}


function getNext() {
  if (currentVideoId >= videoItems.length) {
    var _next = videoItems.first();
  } else {
    var _next = videoItems.eq(currentVideoId + 1);
  }
  return _next;
}

function getPrev() {
  if (currentVideoId <= 0) {
    var _prev = videoItems.last();
  } else {
    var _prev = videoItems.eq(currentVideoId - 1);
  }

  return _prev;
}

function getStatus() {
  nextVideo = getNext(currentVideo);
  prevVideo = getPrev(currentVideo);

  // console.log(currentVideo);
  // console.log(nextVideo);
  // console.log(prevVideo);
}


// Listeners
// ================================

// Update Time stamp while video plays
videoEl.addEventListener("timeupdate", function() {
  var videoProgress = timeFormatted(videoEl.currentTime);
  videoStateCounterProgress.text(videoProgress);
});

// On video finish transition to the next video
videoEl.onended = function(e) {
  changeVideo(nextVideo);
  setPlayState('play');
}


$(window).keypress(function(e) {
  if (e.which === 32 && e.target == document.body) {
    e.preventDefault();
    togglePlayState();
  }
});
