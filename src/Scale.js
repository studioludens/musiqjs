'use strict';
var _ = require('lodash'),
    MUSIQ = require('./base');

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
module.exports = Scale;

Scale.isValidScale = isValidScale;
Scale.isValidScaleList = isValidScaleList;
Scale.fromTonicAndType = fromTonicAndType

// extend chord
Scale.prototype.extend = extend;

/**
 * the MUSIQjs Scale object constructor
 *
 * @param {string} type
 */
function Scale (tonic, type){
    this.tonic = Note.fromNotation(tonic);
    this.type = type;
}


/**
 * create a scale from a tonic note and a type (optional)
 */
function fromTonicAndType( tonic, type ){
    return new Scale();
    // TODO
};

/**
 * extend a scale over a number of octaves
 */
function extend( startOctave, endOctave ){
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

    var scaleRegex = "^" + MUSIQ.NOTE_SIMPLE_REGEX + " ?("+ scaleNames + ")? ?" + MUSIQ.SCALE_REGEX + "$";
    //console.log('scaleRegex', scaleRegex);

    var regex = new RegExp(scaleRegex,"m");
    var matches = regex.exec( not );

    if(!matches) return;
    return {
        note : matches[1],
        acc : matches[2],
        notation : matches[3]
    };

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
