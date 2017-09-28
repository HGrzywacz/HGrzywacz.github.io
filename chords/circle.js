const circleApp = ((id) => {

  var canvasElement = document.getElementById(id)
  var ctx = canvasElement.getContext('2d');

  const width = 2000;
  const height = 2000;

  const mkPoint = (x, y) => ({x: x, y: y});
  const mkSphPoint = (rho, phi) => ({rho: rho, phi: phi});

  const origin = mkPoint(width/2, height/2);

  const transformCoordinates = (sphericalPoint, origin) => {
    var x = sphericalPoint.rho * Math.cos(sphericalPoint.phi - (Math.PI / 2)) + origin.x
    var y = sphericalPoint.rho * Math.sin(sphericalPoint.phi - (Math.PI / 2)) + origin.y
    return mkPoint(x, y);
  };

  const fillTextSpherical = (ctx, origin, text, rho, phi) => {
    var coordinates = transformCoordinates(mkSphPoint(rho, phi), origin);
    ctx.fillText(text, coordinates.x - 30, coordinates.y + 35);
  };

  const sphericalMoveTo = (ctx, origin, rho, phi) => {
    var coordinates = transformCoordinates(mkSphPoint(rho, phi), origin);
    ctx.moveTo(coordinates.x, coordinates.y);
  };

  const sphericalLineTo = (ctx, origin, rho, phi) => {
    var coordinates = transformCoordinates(mkSphPoint(rho, phi), origin);
    ctx.lineTo(coordinates.x, coordinates.y);
  };

  const addLabels = (ctx, notes, origin, angle, chord, chordSounds) => {
    var labelsRho = 850;

    ctx.save();
    // var colors = ['blue', 'red', 'yellow', 'orange'];
    ctx.fillStyle = 'blue';
    var i0 = _.findIndex(notes, (n) => (chordSounds[0] === n));
    fillTextSpherical(ctx, origin, 'R', labelsRho, i0 * angle);

    ctx.fillStyle = 'red';
    var label3 = chord.text1[0];
    var i3  = _.findIndex(notes, (n) => (chordSounds[1] === n));
    fillTextSpherical(ctx, origin, label3, labelsRho, i3 * angle);

    ctx.fillStyle = 'yellow';
    var label5 = chord.text1[1];
    var i5  = _.findIndex(notes, (n) => (chordSounds[2] === n));
    fillTextSpherical(ctx, origin, label5, labelsRho, i5 * angle);

    if (_.size(chordSounds) === 4) {
      ctx.fillStyle = 'orange';
      var label7 = chord.text1[2];
      var i5  = _.findIndex(notes, (n) => (chordSounds[3] === n));
      fillTextSpherical(ctx, origin, label7, labelsRho, i5 * angle);
    }

    ctx.restore();
  };

  const calibrate = (ctx, origin, angle) => {
    // linie do kalibrowania przesunięcia w fillTextSperical tak żeby literki
    // były na środku podanych współrzędnych
    ctx.lineWidth = 10;
    var linesRho = 100;
    ctx.beginPath();
    sphericalMoveTo(ctx, origin, linesRho, 0);
    sphericalLineTo(ctx, origin, linesRho, 2* Math.PI / 3);
    sphericalLineTo(ctx, origin, linesRho, 4 * Math.PI / 3);
    sphericalLineTo(ctx, origin, linesRho, 0);
    ctx.stroke();
    ctx.fillText('E', 970, 1035);
  };

  const putLines = (ctx, origin, angle, indexes) => {
    ctx.save();
    ctx.lineWidth = 10;

    var linesRho = 660;
    ctx.beginPath();
    sphericalMoveTo(ctx, origin, linesRho, angle * _.first(indexes));

    _.each(_.rest(indexes), (index) => {
      sphericalLineTo(ctx, origin, linesRho, index * angle);
    });

    sphericalLineTo(ctx, origin, linesRho, angle * _.first(indexes));

    ctx.stroke();
    ctx.restore();
  };

  const clearCircle = (ctx, origin) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 590, 0, (2 * Math.PI), true);
    ctx.clip();
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  };

  const clearCanvas = (ctx) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  };

  var currentAngles = [0, 0, 0, 0];

  const changeChord = (ctx, notes, origin, angle, chord, chordSounds) => () => {

    if (_.size(currentAngles) === 3) {
      currentAngles = _.concat(currentAngles, [_.last(currentAngles)]);
    }

    var endIndices = _.indices(notes, chordSounds);

    var startAngles = currentAngles.sort();

    var endAngles = _.map(endIndices, (i) => (i * angle)).sort();

    if (_.size(endAngles) === 3) {
      endAngles = _.concat(endAngles, [_.last(endAngles)]);
    }

    var differences = _.zipWith(endAngles, startAngles, ((e, s) => {return e - s}));

    var linesRho = 540;
    var duration = 1000; // ms
    var startTime = new Date().getTime();

    ctx.lineWidth = 10;

    sphericalMoveTo(ctx, origin, linesRho, 3 * angle);

    var step = () => {

      var timestamp = (new Date()).getTime() - startTime;

      if (timestamp > duration) {
        return;
      }

      clearCircle(ctx, origin);
      var ratio = (timestamp % duration) / duration;

      if (ratio < 0) return;

      var angles = _.zipWith(startAngles, differences, ((s, d) => {return s + (d * ratio)}));

      currentAngles = angles.sort();

      ctx.save();
      ctx.beginPath();

      _.each(angles, (angle) => {
        sphericalLineTo(ctx, origin, linesRho, angle);
      });

      sphericalLineTo(ctx, origin, linesRho, angles[0]);

      ctx.stroke();
      ctx.restore();

      window.requestAnimationFrame(step);
    };

    step();
  };

  const makeAddChord = (ctx, notes, origin, angle, putNotes) => (tonic, chord, chordSounds) => {
    clearCanvas(ctx);
    putNotes();
    addLabels(ctx, notes, origin, angle, chord, chordSounds);
    changeChord(ctx, notes, origin, angle, chord, chordSounds)();
  };

  const makePutNotes = (ctx, type) => () => {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 100px sans-serif';

    const compare = (sound, plname) => sound[pl] === plname;

    // ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'A♭', 'E♭', 'B♭', 'F'];
    const fifthsPL = ['c', 'g', 'd', 'a', 'e', 'h', 'fis', 'cis', 'gis', 'dis', 'ais', 'f'];
    const fifths = _.reorderBy(sounds, fifthsPL, compare);

    // _.reverse(['G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'A♭', 'E♭', 'B♭', 'F', 'C']);
    const fourthsPL = _.reverse(['g', 'd', 'a', 'e', 'h', 'fis', 'cis', 'gis', 'dis', 'ais', 'f', 'c']);
    const fourts = _.reorderBy(sounds, fourthsPL, compare);

    // ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    const chromatic = sounds;

    var notes;
    if (type === 'fifths' || type === '5') {
      notes = fifths;
    } else if (type === 'fourths' || type === '4') {
      notes = fourths;
    } else {
      notes = chromatic;
    }

    var angle = 2 * Math.PI / _.size(notes);

    var notesRho = 700;

    var i = 0;
    while (i < notes.length) {
      fillTextSpherical(ctx, origin, notes[i][en], notesRho, (i * angle))
      i++;
    }

    return [notes, angle];
  };

  var type = $(canvasElement).attr('type');


  return () => {
    // putLabels(ctx, origin, angle);

    putNotes = makePutNotes(ctx, type);

    var [notes, angle] = putNotes();

    // $(canvasElement).click(changeChord(notes, ctx, origin, angle, previousChord, nextChord))

    return {
      addChord: makeAddChord(ctx, notes, origin, angle, putNotes)
    };

  };

});
