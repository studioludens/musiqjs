'use strict';

var _ = require('lodash'),
    MUSIQ = require('./base');

module.exports = Interval;

Interval.fromNotes = fromNotes;
Interval.fromNotation = fromNotation;
Interval.fromName = fromNotation; // deprecated!

Interval.prototype.name = name;
Interval.prototype.toString = name;

    /**
 *
 * data structure for an interval
 *
 * @constructor
 *
 * @param {integer} distance - The number of semitones between the notes
 */
function Interval( distance ){

    this.distance = distance;
    this.octaves = Math.floor(this.distance/12);
    this.relativeDistance = this.distance - this.octaves*12;

    //console.log(this.relativeDistance);
}

/**
 * @returns {string} the name of the interval
 */
function name(){
        return MUSIQ.intervalNames[this.relativeDistance];
}

/**
 * lookup the english name of the interval
 *
 * @returns {string} the English name of the interval
 *
 * can be one of the following:
 * "unison"
   "minor second"
   "major second"
   "minor third"
    "major third"
   "fourth"
   "tritone"
   "fifth"
   "minor sixth"
   "major sixth"
   "minor seventh"
   "major seventh"
   "octave"
 *
 */
function fromNotation(notation){

    // TODO: also support more complex interval notations,
    // like : 2 octaves, 3 fourths, etc

    if(_.isNumber(notation)){
        return new Interval(notation);
    } else if( _.isString(notation)){
        var distance = MUSIQ.intervalNames.indexOf( notation );
        if(distance === -1){
            throw new Error('notation not found!');
        }
        return new Interval( distance );
    } else {
        // throw error!
        throw new Error('no valid notation');
    }
}

/**
 * take two notes and create a new Interval object from it
 *
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 *
 * @returns {Interval} A new Interval object
 */
function fromNotes( note1, note2 ){
    return new Interval( note1.distance(note2) );
}

/**
 * creates an interval object, internally calls Interval.fromName()
 *
 * @param {string} name - the name of the interval
 *
 * @returns {Interval}
 */
function interval( name ){
    return Interval.fromName( name );
}

function isValidInterval( notation ){
    
}
