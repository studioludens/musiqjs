var _     = require('lodash'),
    MUSIQ = require('./MUSIQ'),
    Chord = require('./Chord'),
    Note  = require('./Note');
/**
 * the plural class, simply to expose some functions in a more
 * logical way
 *
 * @class
 */
var Chords = {};

module.exports = Chords;
Chords.fromNotes = fromNotes;

Chords.fromNotation = Chord.fromNotation;

/**
 * build a chord from individual notes
 * these can be note objects or just a list of integers
 * @param {array}   notes         - a simple array of integer notes
 * @param {integer} [inversion=0] - the number of the inversion,
 *                                  0 = root position, 1 = first inversion,
 *                                  2 = second inversion, ...
 *
 * @returns {Chord[]} an array of matching chords, null when nothing is found
 */
function fromNotes( notes, inversion ){

    var ret = [];

    // make a nice array of Note objects from the notes parameter
    var noteObjects = _.map( notes, function(note) {
        return new Note(note);
    });

    //console.log( "fromNotes with inversion " + inversion );

    if (_.isNumber(inversion) && inversion > -1) {
        // specified an inversion, we first determine the tonic

        // sort the notes from lowest to highest
        var relNotes = notes.slice();

        relNotes.sort(function(a, b) { return a - b; });

        //_.each(relNotes, function(item){console.log((new Note(item).notation()))});

        // determine the tonic - the lowest note
        var tonic = relNotes[inversion];

        //var uniqueNotes = _.uniq(relNotes);

        // make the notes relative to the tonic
        relNotes = _.map(relNotes, function(note) {
            return note - tonic;
        });

        //console.log(relNotes);

        // wrap negative notes
        relNotes = _.map( relNotes, function(note){
            if( note < 0 ){
                // move it enough octaves up
                var n = note - (Math.floor( note / 12 ) * 12);
                console.assert( n >= 0);
                return n;
            } else {
                return note;
            }
        });

        //console.log(relNotes);

        // now find the chords for all the different possible inversions

        //console.log(relNotes);


        // get the notes within two octaves of the tonic
        var relNotes = _.map(relNotes, function(note) {
            if( note < 0 ) {
                console.log("ERROR: negative note! ");
            }
            else if (note < 12) {
                return note;
            }
            else {
                // filter out special notes, like 9th, 11th and 13th
                var relNote = note % 12;
                if (MUSIQ.chordExtensionNotes.indexOf(relNote) > -1) {
                    return relNote + 12;
                }
                else {
                    return relNote;
                }
            }

        });

        //console.log(relNotes);

        //console.log( relNotes );
        // now remove duplicates
        relNotes = _.uniq(relNotes);

        // sort the notes
        relNotes.sort(function(a, b) { return a - b; });

        //console.log(inversion + " : " + " [ " + relNotes + " ]");

        //console.log("Check descriptors");

        // find chords in the descriptor list that match
        var matchedChordDescrs = _.filter(MUSIQ.chords, function(chord) {

            if( chord.optional ){
                // remove all optional notes from the source array

                // so we're only left with the absolute required notes to form this chord
                var notesReq = _.difference(relNotes, chord.optional);
                var chordNotesReq = _.difference(chord.notes, chord.optional);

                //console.log( notesReq + " - " + chord.notes );

                return _.isEqual(chordNotesReq, relNotes ) || _.isEqual(chordNotesReq, notesReq);
            } else {
                return _.isEqual(chord.notes, relNotes);
            }
        }, this);

        // filter duplicates
        matchedChordDescrs = _.uniq(matchedChordDescrs);

        var matchedChords = _.map( matchedChordDescrs, function(item){
            // add the matched chords to the return array
            return new Chord(noteObjects, item, new Note(tonic));
        } );

        // only log this if we found a matched chord
        if( matchedChords.length > 0){
            // var tonicNote = new Note(tonic);

            //console.log(tonicNote.simpleNotation() + " [ " + relNotes + " ]");
            //console.log( "found in inversion " + inversion  + "(" + tonicNote.simpleNotation() + ") - [ " + relNotes + "]");
            //console.log(notes);
            //console.log(relNotes);
        }

        //console.log( matchedChords );

        return matchedChords;

    }
    // no inversion specified
    else {
        // simple list of chord tonics to check if we have looked for
        // specific chords already
        var chordTonics = [];
        for (var i = 0; i < notes.length; i++) {
            // add matched chords from all inversions of this chord
            var curNote = new Note(notes[i]);

            if( chordTonics.indexOf(curNote.toRelative().pos) > -1){
                continue;
            }

            chordTonics.push(curNote.toRelative().pos);

            var matchedChords = Chords.fromNotes(notes, i);


            ret = ret.concat(matchedChords);
        }

        //console.log( chordTonics);

        //console.log( ret );

        if( !(ret.length > 0) ){
            //console.log("Chord not found!");
        }
        return ret;
    }

}
