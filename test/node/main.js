var MUSIQ    = require('../../src/MUSIQ'),
    Note     = require('../../src/Note'),
    Chord    = require('../../src/Chord'),
    Interval = require('../../src/Interval'),
    Guitar   = require('../../src/guitar/Guitar');

// NOTES

var c = Note.fromNotation('C');
var cSharp = Note.fromNotation('C#');
var g = Note.fromNotation('G');

console.log('c', c);
console.log('cSharp', cSharp, cSharp.toString());

// CHORDS

var cChord = Chord.fromNotation('C');
var fSharpDimChord = Chord.fromNotation('F#dim');

console.log('cChord', cChord);
console.log('fSharpDimChord', fSharpDimChord);

// INTERVALS

var fifthInterval = Interval.fromNotes(c, g);

console.log('fifthInterval', fifthInterval, fifthInterval.toString());

// GUITAR

var guitar = new Guitar();

var cOnGuitar = guitar.chordsFromFingerPos([0,3,2,0,1,0]);

console.log('cOnGuitar', cOnGuitar);