var MUSIQ = require('../../src/MUSIQ');

var cScale = MUSIQ.scale('C')
    .noteObjects()
    .map(note => note.notation())
    .reduce((memo, notation) => memo += notation);

console.log('cScale', cScale);