'use strict';
/** 
 * guitar string class
 * 
 * 
 * @constructor
 * 
 * @param {Guitar} guitar - the Guitar object this String belongs to
 * @param {integer} base - the base note position of this string
 * @param {integer} pos - the position of the string relative to the other strings
 */

var GuitarString = function( guitar, pos, base ){
    
    this.guitar = guitar;
    this.pos = pos;
    this.base = base;
    
};


/**
 * return a Note object for a fret position on this string
 * 
 * @param {GuitarFret} fret - a GuitarFret object we should check the note on
 */
GuitarString.prototype.noteOnFret = function( fret ){
    return this.guitar[this.pos][fret.pos];
};

/**
 * matches a Note object to the fret and returns all GuitarNote objects that
 * match it.
 * 
 * @param {Note} note - a Note object
 * @todo implement function
 */
GuitarString.prototype.matchNotes = function( note ){
    
};

/**
 * get a list of integers that represents all active notes on this string
 * 
 * @returns {integer[]}
 * 
 * @todo implement function
 */
GuitarString.prototype.activeNotes = function( chord ){
    return;
};

/**
 * set the note on the specified fret as the only active note on this string
 * 
 * @param {integer} fret - integer representing the fret position
 * @param {boolean} value - true if the GuitarNote should be set to active
 * 
 * @returns {GuitarString} - return this GuitarString
 */
GuitarString.prototype.onlyActive = function( fret, value ){
    
    _(this.guitar.notes[this.pos]).each(function(note, key){
        if( key == fret )
            note.active(value);
        else
            note.active(false);
            
    },this);
    
    return this;
};