var MUSIQ = require('../../src/MUSIQ');

// from the basic note names
MUSIQ.noteNames
    .map(note => MUSIQ.note(note))
    .map(note => note
        .transpose('octave')
        .transpose('octave')
        .transpose('octave')) // transpose 8 semitones
    .map(note => logFreq(note));

// from a scale
console.log('chord notes', MUSIQ.scale('C').transpose('octave').notes);
    //.map(note => logFreq(note));


// helper functions
function logFreq(note){
    console.log(note.notation(), note.frequency().toFixed(2) + ' Hz');
}
