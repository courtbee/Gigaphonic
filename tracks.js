var client_id = "3bac0c7e3cff7e9c3a0fd3bbbb57718c";

SC.initialize({
  client_id: client_id
});

var loadStream = function (track) {
  return function (callback) {
    SC.stream("/tracks/" + track, function (stream) {
      stream.track = track;

      stream.load({
        onload: function () { callback(null, stream); }
      });
    });
  };
};

var container = $(".tracks");
container.css({ position: "relative" });
var tracks = [];

$("tr", container).each(function (i, el) {
  var trackId = $(el).data("track");

  if (!trackId) return;

  $.get("http://api.soundcloud.com/tracks/" + trackId + ".json?client_id=" + client_id, function (data) {
    $("td", el).html("<img src='" + data.waveform_url + "' id='wave" + trackId + "'>");
  });

  tracks.push(loadStream(trackId));
});

async.parallel(tracks, function (err, streams) {
  var maxLength = 0;

  for (var i = streams.length - 1; i >= 0; i--) {
    var stream = streams[i];
    if (stream.duration > maxLength) {
      maxLength = stream.duration;
    }
  };

  for (var i = streams.length - 1; i >= 0; i--) {
    var stream = streams[i];
    var widthPercentage = stream.duration / maxLength * 100;
    $("#wave" + stream.track).width(widthPercentage + "%");
  };

  var updateCursor = function () {
    var wave = $("td", container).first();
    var containerWidth = wave.width();
    var songDuration = maxLength;
    var playedOffset = stream.position;
    var pixelOffset = playedOffset * containerWidth / songDuration;

    var cursor = $("#playbackCursor");
    cursor.css({ left: wave.position().left + pixelOffset, height: container.height() });

    if (playedOffset < songDuration && isPlaying) {
      window.setTimeout(updateCursor, 100);
    }
  };

  var createCursor = function () {
    var cursor = $("<div id='playbackCursor'></div>");
    cursor.css({
      position: "absolute",
      top: 0,
      left: $("td", container).first().position().left,
      height: container.height(),
      "background-color": "#000",
      width: 1
    });
    container.append(cursor);
  };

  createCursor();

  var controls = $("#controls");

  controls.text("Play");
  var isPlaying = false;

  controls.click(function (event) {
    if (isPlaying) {
      controls.text("Play");
      isPlaying = false;

      for (var i = streams.length - 1; i >= 0; i--) {
        var stream = streams[i];
        stream.pause();
      };
    }
    else {
      controls.text("Pause");
      isPlaying = true;

      for (var i = streams.length - 1; i >= 0; i--) {
        var stream = streams[i];
        stream.play();
      };
    }

    updateCursor();

    event.preventDefault();
  });
});