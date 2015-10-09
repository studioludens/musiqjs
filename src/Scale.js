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

Scale.isValidScale = isValidScale;
Scale.isValidScaleList = isValidScaleList;

module.exports = Scale;

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
    throw new Error('not implemented');
    // check if the scale name is valid
    return false;
}