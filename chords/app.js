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

$(document).ready(() => {
  var fifthsCircle = circleApp('fifths')();
  var chromatic = circleApp('chromatic')();
  var circles = [fifthsCircle, chromatic];

  chordsApp(circles)();
});
