'use strict';
/**
 * the MUSIQ.js scale class
 * 
 * @class
 * 
 * @param notes - a simple array of integers representing the midi notes
 * @param descriptor - an object describing the scale
 * @param tonic - the current tonic Note oject
 * @param relative - if the scale should be interpreted as  relative, 
 *                   i.e. can be positioned anywhere
 *                   on the musical scale (Fretboard for guitar)
 * 
 * @todo implement some methods
 */
var Scale = {}; //_(Chord).extend();

/**
 * create a scale from a tonic note and a type
 */
Scale.fromTonicAndType = function( tonic, type ){
    
};

/**
 * extend a scale over a number of octaves
 */
Scale.extend = function( startOctave, endOctave ){
    this.startOctave = startOctave;
    this.endOctave = endOctave;
};

/*Scale.prototype.type = function(){
    return "scale";
}*/