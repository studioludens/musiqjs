'use strict';

var _        = require('lodash'),
    base     = require('./base'),
    Note     = require('./Note'),
    Chord    = require('./Chord'),
    Chords   = require('./Chords'),
    Scale    = require('./Scale'),
    Interval = require('./Interval'),
    Guitar   = require('./guitar/Guitar');

var MUSIQ = base;

module.exports = MUSIQ;

MUSIQ.match             = match;
MUSIQ.isValidNote       = Note.isValidNote;
MUSIQ.isValidNoteList   = Note.isValidNoteList;
MUSIQ.isValidChord      = Chord.isValidChord;
MUSIQ.isValidChordList  = Chord.isValidChordList;
MUSIQ.isValidScale      = Scale.isValidScale;
MUSIQ.isValidScaleList  = Scale.isValidScaleList;

MUSIQ.note              = note;
MUSIQ.scale             = scale;
MUSIQ.chord             = chord;
MUSIQ.interval          = interval;

MUSIQ.guitar            = guitar;
MUSIQ.guitar.isValidFingerPos = isValidFingerPos;
MUSIQ.guitar.isValidChord = isValidGuitarChord;

// MUSIQ utility functions

/**
 * the very powerful match() function takes a string
 * and tries to find all the matches, be it notes, chords
 * or scales.
 *
 * @param {string} name - a name of a note, chord or scale
 *
 * @returns {array} - an array of match objects (Note/Scale/Chord)
 */
function match( name ){

    var ret = [];

    if( MUSIQ.isValidNote( name )){
        console.log("Match single note");
       ret.push( Note.fromNotation(name) );
    }

    if( MUSIQ.isValidNoteList( name ) ){
        console.log("Match multiple notes");
        ret.concat( Note.fromNotation(name));
    }

    if( MUSIQ.isValidChord( name )){
        console.log("Match single chord");
        ret.push( Chords.fromNotation( name ));
    }
    if( MUSIQ.isValidScale( name )){
        console.log("Match single scale");
        ret.push( Chords.fromNotation( name, 'scale' ) );
    }

    //console.log( "MUSIQ Match: " + name);
    //console.log( ret );

    return ret;
}

/**
 * guitar stuff
 */


/**
 * @returns {array} a list of matches if it's a valid finger position of the notes
 * currently played on a guitar neck
 *
 * example: "0 2 2 1 0 x" - should get an E-chord
 *
 */
function isValidFingerPos( tab ){
    var regex = new RegExp("^((xX|[0-9]{1,2})[ -]*){6}$","m");
    return regex.exec( tab );
};

/**
 * @param {GuitarChord} chord - a GuitarChord object
 *
 * @todo implement function
 */
function isValidGuitarChord( chord ){

}

/**
 * create a note object from a notation
 * @param notation
 * @returns {Note}
 */
function note (notation){
    return Note.fromNotation(notation);
}

function chord (notation){
    return Chord.fromNotation(notation);
}

function interval (note1, note2){
    return Interval.fromNotes(note1, note2);
}

function scale (notation){
    return Chord.fromNotation(notation, 'scale');
}

function guitar (tuning){
    return new Guitar(tuning);
}
