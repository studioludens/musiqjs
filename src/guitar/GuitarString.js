'use strict';

var _ = require('lodash');

module.exports = GuitarString;

GuitarString.prototype.noteOnFret  = noteOnFret;
GuitarString.prototype.matchNotes  = matchNotes;
GuitarString.prototype.activeNotes = activeNotes;
GuitarString.prototype.onlyActive  = onlyActive;

//
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

function GuitarString( guitar, pos, base ){
    
    this.guitar = guitar;
    this.pos = pos;
    this.base = base;
    
}


/**
 * return a Note object for a fret position on this string
 * 
 * @param {GuitarFret} fret - a GuitarFret object we should check the note on
 */
function noteOnFret( fret ){
    return this.guitar[this.pos][fret.pos];
}

/**
 * matches a Note object to the fret and returns all GuitarNote objects that
 * match it.
 * 
 * @param {Note} note - a Note object
 * @todo implement function
 */
function matchNotes( note ){
    throw new Error('not implemented');
};

/**
 * get a list of integers that represents all active notes on this string
 * 
 * @returns {integer[]}
 * 
 * @todo implement function
 */
function activeNotes( chord ){
    throw new Error('not implemented');
}

/**
 * set the note on the specified fret as the only active note on this string
 * 
 * @param {integer} fret - integer representing the fret position
 * @param {boolean} value - true if the GuitarNote should be set to active
 * 
 * @returns {GuitarString} - return this GuitarString
 */
function onlyActive( fret, value ){
    
    _.each(this.guitar.notes[this.pos], function(note, key){
        if( key == fret )
            note.active(value);
        else
            note.active(false);
            
    },this);
    
    return this;
}