'use strict';

module.exports = GuitarFret;

GuitarFret.prototype.className = className;
GuitarFret.prototype.notes = notes;

//
/**
 * GuitarFret - describes a guitar fret
 * 
 * 
 * @constructor
 * 
 * @param {Guitar} guitar - the guitar this fret belongs to
 * @param {integer} pos - the position on the fretboard (0-x, 0 being the lowest string, x is usually 6)
 * 
 * @property {boolean} barre - if it's played barre
 * 
 * the fret automatically calculates a number of useful variables
 * 
 */
function GuitarFret( guitar, pos ){
    
    this.guitar = guitar;
    this.pos    = pos;
    
    /**
     * if it's played barre
     */
    this.barre = false;
};

/**
 * get all notes on this particular fret. Because we can reference
 * to the guitar we can determine all the notes
 * 
 * @returns {array} - Array of GuitarNote objects
 */
function notes(){
    return this.guitar.notesOnFret( this.pos );
}


/**
 * @todo: add this in another place, sort of a 
 * decorator type of function
 * 
 * @returns {string} - 
 */
function className(){
    //console.log(this.pos);
    if( this.pos == 3) return "third";
    if( this.pos == 5) return "fifth";
    if( this.pos == 7) return "seventh";
    if( this.pos == 9) return "ninth";
    if( this.pos == 12 ) return "twelfth";
    
    return;
}

