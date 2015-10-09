'use strict';

var _ = require('lodash'),
    Note = require('../Note');

module.exports = GuitarNote;

GuitarNote.prototype.notation           = notation;
GuitarNote.prototype.simple             = simple;
GuitarNote.prototype.active             = active;
GuitarNote.prototype.tonic              = tonic;
GuitarNote.prototype.ghosted            = ghosted;
GuitarNote.prototype.fretPos            = fretPos;
GuitarNote.prototype.stringPos          = stringPos;
GuitarNote.prototype.onlyActive         = onlyActive;
GuitarNote.prototype.className          = className;
GuitarNote.prototype.intervalToTonic    = intervalToTonic;
GuitarNote.prototype.notePos            = notePos;
GuitarNote.prototype.relPos             = relativeNotePos;
GuitarNote.prototype.relativeNotePos    = relativeNotePos;
GuitarNote.prototype.distanceTo         = distanceTo;
GuitarNote.prototype.toString           = toString;
//
/** 
 * the guitar note data object
 * 
 * 
 * @constructor
 * 
 * @param {Guitar} guitar - a Guitar object this note belongs to
 * @param {GuitarString} guitarString - a GuitarString object this note belongs to
 * @param {GuitarFret} fret - the GuitarFret this note belongs to
 * @param {array} pos - the position as in [ string, fret ]
 * 
 * @param {object} state - an object representing the state of the note:
 *                         active: false,
 *                          ghosted: false,
 *                          tonic: false
 *                      
 */
function GuitarNote( guitar, guitarString, fret, pos, state ){

    this.guitar = guitar;
    this.guitarString = guitarString;
    this.fret = fret;
    this.pos = pos;
    
    //console.log( this.pos );
    
    this.state = state || _.clone( GuitarNote.DEFAULT_STATE );
    
    /*
     * create a Note object for easy access
     */
    this.note = new Note( guitarString.base + fret.pos );

    //console.log( this.note );
}

/**
 * the default state of the guitar note. 
 * when you use this, make sure to MAKE A COPY!
 */
GuitarNote.DEFAULT_STATE = { active: false, ghosted: false, tonic: false };

/**
 * get the notation
 * 
 * @returns {string} the notation
 */
function notation(){
    return this.note.notation();
}

/**
 * get the short notation
 * 
 * @param {integer} signature
 * 
 * @returns {string} the Chord notation
 */
function simple( signature ){
    return this.note.simpleNotation( signature );
}


/**
 * sets or gets the active state. 
 * 
 * @param {boolean} value 
 * @returns {boolean} true if the state is active
 */
function active( value ){
    if( typeof value != 'undefined'){
        this.state.active = value;
        return this.state.active;
    } else {
        return this.state.active;
    }
}

/**
 * sets or gets the tonic state. 
 * 
 * @param {Note} value - a Note object
 * @returns {boolean} true if the state is tonic
 */
function tonic( value ){
    if( typeof value != 'undefined'){
        this.state.tonic = value;
        return this.state.tonic;
    } else {
        return this.state.tonic;
    }
}

/**
 * sets or gets the active state. 
 * 
 * @param {boolean} value
 * @returns {boolean} true if the state is active
 */
function ghosted( value ){
    if( typeof value !== 'undefined'){
        this.state.ghosted = value;
        return this.state.ghosted;
    } else {
        return this.state.ghosted;
    }
}

/**
 * 
 * @returns {integer} - number of the fret this note is on
 */
function fretPos(){
    return this.pos[1];
}

/**
 * 
 * @returns {integer} - number of the string this note is on
 *                      0 is the lowest string (in standard Guitar tuning
 *                      this would be the low E)
 */
function stringPos(){
    return this.pos[0];
}

/**
 * sets this note as the only active note on the string
 * 
 * @param {boolean} value - 
 * @returns {boolean} 
 */
function onlyActive( value ){
    return this.guitarString.onlyActive( this.pos[1], value );
}

/**
 * get a string representation of the class
 * 
 * @param {Note} [tonic] optionally specify a tonic. If so, the interval to the tonic is added as well
 * @returns {string} 
 */
function className( tonic ){
   var ret = [];
   if( this.state.active )  ret.push('active');
   if( this.state.ghosted ) ret.push('ghosted');
   if( this.state.tonic )   ret.push('tonic');
   
   // add the interval to the tonic as well
   if( tonic ) ret.push(this.intervalToTonic(tonic).name().replace(" ","-"));
   
   return ret.join(' ');
}

/**
 * the interval to the tonic
 * 
 * @param {Note} tonic - A Note object representing the tonic
 * 
 * @returns {Interval} an Interval object relative to the tonic
 */
function intervalToTonic( tonic ){
    if( tonic )
        return tonic.interval( this.note );
}

/**
 * get the int note position
 * 
 * @returns {integer} the MIDI position of the note
 */
function notePos(){
    return this.note.pos;
}

/**
 * get the relative note position
 * 
 * @returns {integer} the relative position of the note
 */
function relativeNotePos(){
    return this.note.toRelative().pos;
}

/**
 * get the 'distance' of a fret to another note on the fretboard
 * @returns {array} an array with 2 elements [ strings, frets ]
 * 
 */
function distanceTo( otherNote ){
    return [ otherNote.pos[0] - this.pos[0], otherNote.pos[1] - this.pos[1] ];
}

function toString (){
    return '[GuitarNote ' + this.note.toString() + ']';
}