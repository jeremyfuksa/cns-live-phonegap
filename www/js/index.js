var progressTimer;
var playButton;
var stopButton;
var activityIndicator;
var textPosition;
var myaudioURL = 'http://184.154.90.186:8064/stream';
var myaudio = new Audio(myaudioURL);
var isPlaying = false;
var readyStateInterval = null;
var html5audio = {
	play: function() {
		isPlaying = true;
		myaudio.play();
		playButton.className = 'transport hidden';
		stopButton.className = 'transport pause';
		//_gaq.push(['_trackEvent', 'Button', 'Play']);
		readyStateInterval = setInterval(function(){
			 if (myaudio.readyState <= 2) {
				 textPosition.innerHTML = 'Loading&hellip;';
			 }
		},1000);
		myaudio.addEventListener("timeupdate", function() {
			 var s = parseInt(myaudio.currentTime % 60);
			 var m = parseInt((myaudio.currentTime / 60) % 60);
			 var h = parseInt(((myaudio.currentTime / 60) / 60) % 60);
			 if (isPlaying && myaudio.currentTime > 0) {
				 textPosition.innerHTML = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
			 }
		}, false);
		myaudio.addEventListener("error", function() {
			 console.log('myaudio ERROR');
		}, false);
		myaudio.addEventListener("canplay", function() {
			 console.log('myaudio CAN PLAY');
		}, false);
		myaudio.addEventListener("waiting", function() {
			 console.log('myaudio WAITING');
			 isPlaying = false;
			 //playButton.className.replace( /(?:^|\s)hidden(?!\S)/g , '' );
			 //stopButton.className += 'hidden';
		}, false);
		myaudio.addEventListener("playing", function() {
			 isPlaying = true;
			 //playButton.className += 'hidden';
			 //stopButton.className.replace( /(?:^|\s)hidden(?!\S)/g , '' );
		}, false);
		myaudio.addEventListener("ended", function() {
			 html5audio.stop();
			 navigator.notification.confirm(
				'Streaming failed. Possibly due to a network error.', // message
				onConfirmRetry,	// callback to invoke with index of button pressed
				'Stream error',	// title
				'Retry,OK'		// buttonLabels
			 );
		}, false);
	},
	pause: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		//_gaq.push(['_trackEvent', 'Button', 'Pause']);
		stopButton.className = 'transport pause hidden';
		playButton.className = 'transport';
	},
	stop: function() {
		isPlaying = false;
		clearInterval(readyStateInterval);
		myaudio.pause();
		//_gaq.push(['_trackEvent', 'Button', 'Stop']);
		stopButton.className = 'transport pause hidden';
		playButton.className = 'transport';
		myaudio = null;
		myaudio = new Audio(myaudioURL);
		textPosition.innerHTML = 'Stopped.';
	}
};

function init() {
    var windowHeight = window.height();
    if (windowHeight <= 480) {
        $('body').addClass('iphone4');
        $('#beerBuddyBanner').attr('src','img/beer-buddy-iphone4.png');
    } else {
        $('body').addClass('iphone5');
        $('#beerBuddyBanner').attr('src','img/beer-buddy-iphone5.png');
    }
    getStreamInfo();
    getDateInfo();
    html5audio.play();
}

function onError(error) {
	console.log(error.message);
}

function onConfirmRetry(button) {
	if (button == 1) {
		html5audio.play();
	}
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number
}

function beerbuddy() {
	window.open('http://cocktailnapkinstudios.com/beerbuddy?utm_source=ios&utm_medium=app&utm_campaign=beerbuddy','_blank','location=yes');
}

function getStreamInfo() {
	var data = {};
	$.ajax({
		type: 		'GET',
		url: 		'http://cp6.shoutcheap.com:2199/rpc/jeremyfu/streaminfo.get',
		dataType:	'jsonp',
		data: 		data,
		success: 	function(data){
						parseStreamInfo(data);
					}
	});
}

function parseStreamInfo(json) {
	var liveArt = "img/on-air-live.png";
	var offlineArt = "img/offline.png";
	var dataArray = json.data[0];
	var currentTrack = dataArray.track.title;
	var artCode = dataArray.track.album;
	var albumArt = "http://cocktailnapkinstudios.com/images/uploads/" + artCode.toLowerCase();
	var serverStatus = dataArray.server;
	if(serverStatus == "Online") {
		if(currentTrack == "On Air LIVE") {
			$('#albumArt').attr('src',liveArt);
		} else {
			$('#albumArt').attr('src',albumArt);
		}
		$('#currentTrack').html(currentTrack);
	} else {
		$('#currentTrack').html("Currently Offline");
		$('#albumArt').attr('src',offlineArt);
	}
	if (isPlaying == true) {
		setTimeout(function(){ getStreamInfo(); }, 1000);
	}
}

function getDateInfo() {
    var gcData = {};
    $.ajax({
        type:       'GET',
        url:        'http://www.google.com/calendar/feeds/calendar%40jeremyfuksa.com/public/full?alt=json&orderby=starttime&max-results=1&singleevents=true&sortorder=ascending&futureevents=true',
        dataType:   'jsonp',
        data:       gcData,
        success:    function(gcData) {
                        parseDateInfo(gcData);
                    }
    });
}

function parseDateInfo(json) {
    var gcDataArray = json.feed;
    var nextStartTime = gcDataArray.entry[0].gd$when[0].startTime.substring(0, 19);
    $('#nextSession').html(Date.parse(nextStartTime).toString('MMMM d, h:mmtt') + " Central");
}