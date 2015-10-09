var MUSIQ    = require('../../src/MUSIQ');

// NOTES

var c = MUSIQ.note('C');
var cSharp = MUSIQ.note('C#');
var g = MUSIQ.note('G');

console.log('c', c);
console.log('cSharp', cSharp, cSharp.toString());

// CHORDS

var cChord = MUSIQ.chord('C');
var fSharpDimChord = MUSIQ.chord('F#dim');

console.log('cChord', cChord);
console.log('fSharpDimChord', fSharpDimChord);

// INTERVALS

var fifthInterval = MUSIQ.interval(c, g);

console.log('fifthInterval', fifthInterval, fifthInterval.toString());

// GUITAR

var guitar = MUSIQ.guitar();

var cOnGuitar = guitar.chordsFromFingerPos([0,3,2,0,1,0]);

console.log('cOnGuitar', cOnGuitar);