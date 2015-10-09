'use strict';

var _ = require('lodash'),
    base = require('./base');


var MUSIQ = base;

module.exports = MUSIQ;

MUSIQ.match             = match;
MUSIQ.isValidNote       = isValidNote;
MUSIQ.isValidNoteList   = isValidNoteList;
MUSIQ.isValidChord      = isValidChord;
MUSIQ.isValidChordList  = isValidChordList;
MUSIQ.isValidScale      = isValidScale;
MUSIQ.isValidScaleList  = isValidScaleList;

MUSIQ.guitar = {};
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
    
    console.log( "MusiQ MAtch: " + name)
    console.log( ret )
    
    return ret;
}


/**
 * isValidNote
 * 
 * @param {string} notation - a string notation for a note
 * 
 * @returns {boolean} true if the note can be parsed into a Note object
 */
function isValidNote( notation ){
    
    if( !notation ) return false;
    
    var regex = new RegExp("^" + MUSIQ.NOTE_REGEX + "?$","m");
    return regex.exec( notation );
    
}

/**
 * 
 * @param {array} list
 * @returns {boolean} true if the list (in string format) is a valid list
 * we can use thesse delimiters:  " " (space), "," (comma) and "|" (pipe)
 * more probably to follow...
 * 
 * @todo: implement this function
 * 
 */
function isValidNoteList( list ){
   // split the list 
   return false;
}

/**
 * 
 * @todo: store these in a static variable when the function is first called
 * 
 * @param {string} notation - string notation to check if valid
 * 
 * @returns {array} matches from the regular expression if it's a valid chord
 *              0 : the whole matched name
 *              1 : the note
 *              2 : any specified accidentals
 *              3 : chord indicator / name
 */
function isValidChord( notation ){
    
    if( !notation) return false;
    
    // default to major
    var not = notation;
    if( !notation || notation.length == 0 ) not = "M";
    
    // TODO: make this shorter
    /*
    var chordNames = 
       _.chain(MUSIQ.chords)
        .pluck("longname")
        .union( 
            _.pluck(MUSIQ.chords, "names") )
        .value()
        .join("|");
    */
    
    var chordNames = _.reduce(MUSIQ.chords, function(memo, item){
        var m = _.isString(memo) ? memo : memo.names.join("|") + "|" + memo.longName;
        //console.log(m);
        return m + "|" + item.names.join("|") + "|" + item.longName;
    });
    
    var regex = new RegExp("^" + MUSIQ.NOTE_SIMPLE_REGEX + " ?("+ chordNames + ")? ?" + MUSIQ.CHORD_REGEX + "$","m");
    //console.log( regex );
    return regex.exec( not );
}

/**
 * @param {array} list - list of strings with chord names
 * @returns {boolean} true if all chords are valid
 * 
 * @todo - implement function
 */
function isValidChordList( list ){
    // check if the chord name is valid
    return false;
}

/**
 * 
 * @param {string} notation - 
 * @returns {boolean} true if it's a valid scale
 */
function isValidScale( notation ){
    
    if( !notation) return false;
    
    // default to major
    var not = notation;
    if( !notation || notation.length === 0 ) not = "M";
    
    // TODO: make this shorter
    
    var scaleNames = _.reduce(MUSIQ.scales, function(memo, item){
        var m = _.isString(memo) ? memo : memo.names.join("|");
        //console.log(m);
        return m + "|" + item.names.join("|");
    });
    
    var regex = new RegExp("^" + MUSIQ.NOTE_SIMPLE_REGEX + " ?("+ scaleNames + ")? ?" + MUSIQ.SCALE_REGEX + "$","m");
    return regex.exec( not );
}

/**
 * @returns {boolean} true if
 * 
 * @todo implement function
 */
function isValidScaleList( chord ){
    // check if the scale name is valid
    return false;
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
