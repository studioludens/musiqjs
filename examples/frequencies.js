var MUSIQ = require('../src/MUSIQ');

// from the basic note names
MUSIQ.noteNames
    .map(note => MUSIQ.note(note))
    .map(note => note.toAbsolute())
    //.map(note => { console.log(note); return note; })
    .map(note => note.transpose('octave'))
    .map(note => note.transpose('octave'))
    .map(note => note.transpose('octave')) // transpose three octaves
    .map(note => logFreq(note));

// from a scale
console.log('C chromatic scale');
MUSIQ.scale('C chromatic')
    .transpose('octave')
    .noteObjects()
    .map(note => logFreq(note));

// concert pitch
console.log('concert pitch (A4):', MUSIQ.note('A4').frequency().toFixed(3) + 'Hz')
// helper functions
function logFreq (note) {
    console.log(padLeft(note.notation(), 3), note.frequency().toFixed(3) + ' Hz');
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||' ')+nr;
}