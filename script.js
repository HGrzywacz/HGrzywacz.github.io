var init = function () {

  var audios = files.map(function (path) {return new Audio(path)});

  var randomElement = function (items) {
    return items[Math.floor(Math.random() * items.length)];
  };

  var bzyk = $('#bzyk');

  var animate = function (duration) {

    var w = $(document).width();
    var factor = 1.2;

    bzyk
      .css('visibility', 'visible')
      .css('transition', 'transform ' + (duration * factor) + 's')
      .css('transition-timing-function', 'ease-in')
      .css('transform', 'translate(' + (w + 1000) + 'px)');

    window.setTimeout(function () {
      bzyk
        .css('transition', '')
        .css('transform',  '')
        .css('visibility', 'hidden');
    }, (duration * 1000 * factor));

  };

  var playAudio = function () {
    var audio = randomElement(audios);

    audio.play();

    animate(audio.duration);

    audio.addEventListener("ended", function(){
      audio.currentTime = 0;
    });

  };

  var kopiujRandomowe = function (rzeczy) {
    var randomowe = randomElement(rzeczy);

    $("#copytext").text(randomowe).select();
    document.execCommand('copy');

    playAudio();
  };

  var kopiujCytat = function () {kopiujRandomowe(cytaty)};
  var kopiujPrzyslowie = function () {kopiujRandomowe(przyslowia)};
  var kopiujPazdiocha = function () {kopiujRandomowe(pazdzioch)};
  var kopiujMaksyme = function () {kopiujRandomowe(maksymy)};

  $("#przyslowie").click(kopiujPrzyslowie);
  $("#cytat").click(kopiujCytat);
  $("#pazdzioch").click(kopiujPazdiocha);
  $("#maksyma").click(kopiujMaksyme);

};


$(document).ready(init)
