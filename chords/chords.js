_.mixin({
  fmap: (f, obj) => _.map(obj, f),
  bypass: (obj, f) => {
    f(obj);
    return obj;
  },
  log: (obj, label) => {
    console.log(label, obj);
    return obj;
  },
  dropUntil: (arr, p) => {
    var index = _.findIndex(arr, p);
    return _.drop(arr, index);
  },
  zipWith: (a1, a2, f) => {
    return _.first(_.map(_.zip(a1, a2), (pair) => {
      return f(pair[0], pair[1]);
    }), _.min([_.size(a1), _.size(a2)]))
  },
  concat: (...args) => {
    return _.chain(args).compact().toArray().flatten(true).value();
  }
});

const chordsApp = (() => {

  const setTitle = (title) => $(document).prop('title', title);

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const [c, cis, d, dis, e, f, fis, g, gis, a, ais, h] =
    _.fmap(Symbol, ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'h']);

  const [b] = [ais];
  const sound = Symbol('sound');
  const pl = Symbol('pl');
  const en = Symbol('en');
  const enflat = Symbol('enflat');

  const sounds = [
    {[sound]: c, [pl]: 'c', [en]: 'C', [enflat]: 'C'},
    {[sound]: cis, [pl]: 'cis', [en]: 'C♯', [enflat]: 'D♭'},
    {[sound]: d, [pl]: 'd', [en]: 'D', [enflat]: 'D'},
    {[sound]: dis, [pl]: 'dis', [en]: 'D♯', [enflat]: 'E♭'},
    {[sound]: e, [pl]: 'e', [en]: 'E', [enflat]: 'E'},
    {[sound]: f, [pl]: 'f', [en]: 'F', [enflat]: 'F'},
    {[sound]: fis, [pl]: 'fis', [en]: 'F♯', [enflat]: 'G♭'},
    {[sound]: g, [pl]: 'g', [en]: 'G', [enflat]: 'G'},
    {[sound]: gis, [pl]: 'gis', [en]: 'G♯', [enflat]: 'A♭'},
    {[sound]: a, [pl]: 'a', [en]: 'A', [enflat]: 'A'},
    {[sound]: ais, [pl]: 'ais', [en]: 'A♯', [enflat]: 'B♭'},
    {[sound]: h, [pl]: 'h', [en]: 'B', [enflat]: 'B'}
  ];

  const soundsArr = (() => _.concat(sounds, sounds, sounds))();

  const [unison, majorThird, minorThird] =
    _.fmap(Symbol, ['unison', 'majorThird', 'minorThird']);

  const intervals = {
    [unison]: 0,
    [minorThird]: 3,
    [majorThird]: 4
  };

  const [major, minor, diminished, augumented, seven, majorSeven, minorSeven] =
    _.fmap(Symbol, ['major', 'minor', 'diminished', 'augumented', 'seven', 'majorSeven', 'minorSeven'])

  const chordsTypes = [major, minor, diminished, augumented, seven, majorSeven, minorSeven];

  const appendSounds = (sounds, row, sharps) => {

    var lang = (sharps === 'flats') ? enflat : en;

    _.each(sounds, (sound) => {
      $('<td>' + sound[lang].toUpperCase() + '</td>')
        .addClass(sound[pl])
        .attr('note', sound[pl])
        .on('click', onClick)
        .appendTo(row);
    });
  };

  const clearSounds = (row) => {
    $(row).children('td').remove();
  };

  const byIntervals = (sounds, chordIntervals) => {
    var absIntervals = _.foldl(_.rest(chordIntervals), ((memo, interval) => {
      return _.concat(memo, [_.last(memo) + intervals[interval]]);
    }), [intervals[_.first(chordIntervals)]]);

    return _.foldl(absIntervals, (memo, interval) => {
      return _.concat(memo, [sounds[interval]]);
    }, []);
  };

  const chords = {
    [major]: {id: 'majortriad', name: "major",
      intervals: [unison, majorThird, minorThird],
      text1: 'M3 + P5', text2: 'major + minor'},

    [minor]: {id: 'minortriad', name: "minor",
      intervals: [unison, minorThird, majorThird],
      text1: 'm3 + P5', text2: 'minor + major'},

    [diminished]: {id: 'diminishedtriad', name: "diminished",
      intervals: [unison, minorThird, minorThird],
      text1: 'm3 + d5', text2: 'minor + minor'},

    [augumented]: {id: 'augumentedtriad', name: "augumented",
      intervals: [unison, majorThird, majorThird],
      text1: 'M3 + m3', text2: 'major + major'},

    [seven]: {id: 'seven', name: "7",
      intervals: [unison, majorThird, minorThird, minorThird],
      text1: 'M3 + P5 + m7', text2: 'major + minor + minor'},

    [majorSeven]: {id: 'majorSeven', name: "maj7",
      intervals: [unison, majorThird, minorThird, majorThird],
      text1: 'M3 + P5 + M7', text2: 'major + minor + major'},

    [minorSeven]: {id: 'minorSeven', name: "min7",
      intervals: [unison, minorThird, majorThird, minorThird],
      text1: 'm3 + P5 + M6', text2: 'minor + major + minor'}
  };

  const makeChord = (tonic, chord) => {
    var rest = _.rest(soundsArr, _.indexOf(sounds, tonic));
    return byIntervals(rest, chord.intervals);
  };

  const printChord = (tonic, chord) => {

    var row = $('<tr></tr>').addClass('chord');

    row.append($('<td>' + chord.name + '</td>').addClass('chordname'));

    chordSounds = makeChord(tonic, chord);

    var soundsRow = $('<tr>')

    appendSounds(chordSounds, soundsRow);

    var soundsCell = $('<td>').append($('<table>').addClass('table').addClass('scale').append(soundsRow))

    row.append(soundsCell);

    row.append($('<td>' + chord.text1 + '</td>').addClass('text1'));
    row.append($('<td>' + chord.text2 + '</td>').addClass('text2'));

    row.hover(makeOnHover(tonic, chord), outHover);

    $('.container table.main').append(row);
  };

  const printAllNotes = (tonic) => {
    var row = $('.allnotes tr');

    var sharps = $('#sharps').val();

    clearSounds(row);
    appendSounds(sounds, row, sharps);

    $('.allnotes .' + tonic[pl]).addClass('tonic');
  };

  const printChromaticScale = (tonic) => {
    var row = $('.chromatic tr');

    var rest = _.take(_.rest(soundsArr, _.indexOf(sounds, tonic)), 12);

    var sharps = $('#sharps').val();

    clearSounds(row);
    appendSounds(rest, row, sharps);

    $('.chromatic .' + tonic[pl]).addClass('tonic');
  };

  const printChosenScale = (tonic) => {
    var row = $('.chosenscale tr');

    var scales = {
      major: [0, 2, 4, 5, 7, 9, 11, 12],
      minor: [0, 2, 3, 5, 7, 8, 10, 12],
      majorpentatonic: [0, 2, 4, 7, 9, 12],
      minorpentatonic: [0, 3, 5, 7, 10, 12],
      blues: [0, 3, 5, 6, 7, 10, 12],
    };

    var type = $('#chosenscale').val();

    var degrees = scales[type];

    var rest = _.rest(soundsArr, _.indexOf(sounds, tonic));
    var majorScale = _.filter(rest, ((v, i) => {return _.contains(degrees, i)}));

    var sharps;
    if (_.contains([c, g, d, a, e, h, fis], tonic[sound])) {
      sharps = 'sharps';
    } else {
      sharps = 'flats';
    }

    clearSounds(row);
    appendSounds(majorScale, row, sharps);
  };

  const clear = () => {
    $('.table-container table tr td').remove();
    $('.chord').remove();
  };

  const onClick = (event) => {
    var newTonic = _.find(sounds, ((sound) => (sound[pl] === $(event.target).attr('note'))));

    clear()
    printTables(newTonic);
  };

  const makeOnHover = (tonic, chord) => (event) => {
    var sounds = makeChord(tonic, chord);

    _.each(sounds, ((sound) => {
      $('.' + sound[pl]).addClass('active');
    }));
  };

  const outHover = () => {
    $('.active').removeClass('active');
  };

  const printTables = (tonic) => {
    printAllNotes(tonic);
    printChromaticScale(tonic);
    printChosenScale(tonic);

    _.mapObject(chordsTypes, ((chordType) => {
      var chord = chords[chordType];
      printChord(tonic, chord);
    }));

    $('#sharps').change(() => {
      printAllNotes(tonic);
      printChromaticScale(tonic);
    });

    $('#chosenscale').change(() => printChosenScale(tonic));
  };

  return () => {
    setTitle('Chords');
    var tonic = sounds[0];
    printTables(tonic);
  };

})();
