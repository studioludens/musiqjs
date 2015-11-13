'use strict';

var _        = require('lodash'),
    MUSIQ    = require('./base'),
    Interval = require('./Interval');

module.exports = Note;

Note.notation                   = notation;
Note.simpleNotation             = simpleNotation;
Note.solfege                    = solfege;
// generator functions
Note.fromNotation               = fromNotation;
Note.fromPos                    = fromPos;
Note.fromJSON                   = fromJSON;
Note.fromObject                 = fromObject;
// calculation functions
Note.distance                   = distance;
Note.relativeDistance           = relativeDistance;
Note.shortestDistance           = shortestDistance;
Note.shortestRelativeDistance   = shortestRelativeDistance;
Note.interval                   = interval;
Note.signature                  = signature;
Note.cofPosition                = cofPosition;
Note.transpose                  = transpose;
Note.isValidNote                = isValidNote;
Note.isValidNoteList            = isValidNoteList;

// prototype methods
Note.prototype.notation         = protoNotation;
Note.prototype.simple           = protoSimpleNotation;
Note.prototype.simpleNotation   = protoSimpleNotation;

Note.prototype.distance         = protoDistance;
Note.prototype.relativeDistance = protoRelativeDistance;
Note.prototype.shortestDistance = protoShortestDistance;
Note.prototype.shortestRelativeDistance = protoShortestRelativeDistance;
Note.prototype.interval         = protoInterval;

Note.prototype.signature        = protoSignature;
Note.prototype.cofPosition      = protoCofPosition;
Note.prototype.hasName          = protoHasName;
Note.prototype.octave           = protoOctave;
Note.prototype.toRelative       = protoToRelative;
Note.prototype.rel              = protoToRelative;
Note.prototype.toAbsolute       = protoToAbsolute;
Note.prototype.relPos           = protoRelPos;
Note.prototype.transpose        = protoTranspose;
Note.prototype.type             = protoType;
Note.prototype.frequency        = protoFrequency;
Note.prototype.toString         = protoSimpleNotation;


/**
 * the MUSIQ.js Note object
 *
 * @constructor
 * @param {integer} pos - the midi position of the note
 * @param {boolean} relative - a boolean, true if the note is relative (it doesn't have
 *                   an octave). if relative is true, pos should not be larger
 *                   than 12
 * @param {integer} acc - the number of accidentals (-3 to 3), negative represents b (flats),
 *                   positive represent # (sharps)
 */
function Note( pos, relative, acc ){
    this.pos = pos;
    this.relative = relative || false;
    this.acc = acc || 0;

    // if the note is relative, decrease the position to fall inbetween
    // 0 <= pos < 12
    // TODO: change this behaviour because it changes the pos variable
    if( this.relative ){
        this.pos = this.pos % 12;
    }
}


 /**
  * get a new note object from a string notation or an existing note
  * sort of constructor function?
  *
  * @param {string} notation - in the form C4, Bb6 etc
             where the number is the octave
             this should also match lowerCase notations

  * @returns {Note} a note object or null, when no note could be found
 */
function fromNotation( notation ){

    var ret;
    // split the notation
    if( !notation ) return;

    // check if it's already a Note object
    if( notation instanceof Note) return notation;

    var parsedNotation = parseNoteNotation( notation );

    // no chord found?
    if( !parsedNotation ){
        //console.warn("Note not found : " + notation);
        return;
    }

    var note = parsedNotation.note;
     // it should support  b and ♭ for flats, # and ♯ for sharps
    var acc = (parsedNotation.acc || "").replace("♭","b").replace("♯","#");
    var octave = +parsedNotation.octave || 0 ;

    // convert octave to integer, defaulting on 0 (if parsing fails)

    // if no octave is specified
    // but if a 0 is explicitly mentioned (like in C0)
    // it's not a relative note

    var relative = octave < 1;
    if( parsedNotation.octave == "0" ) relative = false;

    //console.log(" Note " + notation + " octave = " + octave + ", relative = " + relative + ", acc = " + acc);

    // just one note
    //console.log(items);

    // get note position
    var nn = note.toUpperCase();
    var npos = MUSIQ.notePositions[ MUSIQ.noteNames.indexOf( nn ) ];

    //console.log( npos );

    // get accidental position
    acc = MUSIQ.accidentals.indexOf( acc ) - 3;

    // error case
    if( acc < -3 || typeof npos == 'undefined' || npos < 0 ){
        // sorry, nothing we can do
        console.warn("ERROR: note not found (" + notation + ")");
        return null;
    }

    // check if the final position is below 0, and it is relative, if so, add an octave
    var finalPos = npos + acc + octave * 12;
    if( finalPos < 0 && relative ){
        finalPos += 12;
    }
    // build the note together with the octave
    ret = new Note( finalPos, relative, acc );

    return ret;

}

/**
 * make a note object from a position
 *
 * @param {integer} pos - the midi position of the note
 *
 * @returns {Note}
 */
function fromPos( pos ){
    //console.log( pos );
    if(Number.isInteger(pos)){
        return new Note( pos );
    }
}

/**
 * convert a JSON string into a Note object
 * @param  {String} json [description]
 * @return {Note}      [description]
 */
function fromJSON(json) {
    return fromObject(JSON.parse(json));
}

/**
 * convert a JS object into a note1
 * @param  {} o Object
 * @return {Note}   Note object
 */
function fromObject(o){
    return new Note(o.pos, o.relative, o.acc);
}
/**
 * the distance (in semitones) to another note
 * this is the number notation of the interval
 *
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {integer} The distance between the notes in semitones
 */
function distance (note1, note2) {
    if (note1 instanceof Note && note2 instanceof Note) {
        return note2.pos - note1.pos;
    }
}

/**
 * returns the relative distance from note1 to note2
 *
 * this is an integer from 0 - 11 representing the distance in semitones between
 * the notes
 *
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 *
 * @returns {integer} The relative distance between the notes in semitones
 */
function relativeDistance (note1, note2) {
    if(!(note1 instanceof Note && note2 instanceof Note)) return;

    var rel = note2.toRelative().pos - note1.toRelative().pos;
    return ( rel < 0 ) ? rel + 12 : rel;
}

/**
 *
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {integer} the shortest distance from note1 to note2
 *
 */
function shortestDistance (note1, note2) {
    return Math.abs(distance(note1, note2));
}

/**
 * @returns {integer} the shortest relative distance
 *
 * @todo - implement function
 */
function shortestRelativeDistance( note1, note2 ){
    return Math.min(relativeDistance(note1,note2), relativeDistance(note2, note1));
}


/**
 * the interval between the notes
 *
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {Interval} The interval between the notes
 */
function interval(note1, note2){
    return Interval.fromNotes(note1, note2);
}

/**
 *
 * The signature as an integer representing the amount
 * of sharps or flats the scale has when using this
 * note as root.
 *
 * @param {Note} note - a Note object
 *
 * @returns {integer}   The signature as an integer representing the amount
 *                      of sharps or flats the scale has when using this
 *                      note as root.
 */
function signature (note) {
    return MUSIQ.signatures[note.relPos()];
}

/**
 * the Note's position on the circle of fifths
 *
 * @param {Note} note - a Note object
 *
 * @returns {integer}   the position on the circle of fifths as an integer
 *                      ( C = 0, G = 1, D = 2, ... F = -1 )
 */
function cofPosition( note ){
    return MUSIQ.cofPositions[note.toRelative().pos];
}

/**
 * get the proper notation for a note
 *
 * In the end, we use the unicode characters ♭ and ♯ to represent sharps and
 * flats, instead of b or #
 *
 * @param {Note} note - A Note object
 * @param {integer} signature - the amount of sharps of flats
 *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
 *
 * @returns {string} the notation used based on the
 */
function notation(note){
    // octave
    var oct = (!note.relative ? note.octave() : "");
    return simpleNotation(note) + oct;
}

/**
 * get a simple notation for a note, i.e. C#
 *
 * @param {Note} note - A note object
 * @param {integer} signature - the amount of sharps of flats
 *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
 *
 * @returns {string}
 */
function simpleNotation(note){
// index in the array
    var i = (note.relPos() - note.acc + 12) % 12;

    // get closest whole note
    // get accidentals
    if(note.acc < 0) {
        return MUSIQ.flatNames[i] + 'b'.repeat(-note.acc);
    }
    return MUSIQ.sharpNames[i] + '#'.repeat(note.acc);
}

/**
 * returns the solfege for the note, i.e. C is do
 * @param note
 * @returns {String}
 */
function solfege (note){
    return MUSIQ.solfege[note.relPos()];
}

/**
 * transpose a note with an interval
 * @param {Note} note - A note object
 * @param {Interval} interval - An interval object
 */
function transpose( note, interval ){
    // check if it's an interval object
    if( _.isNumber(interval) ){
        return new Note(note.pos + interval, note.relative, note.acc);
    } else if(_.isString(interval) ) {
        return new Note(note.pos + Interval.fromNotation(interval).distance, note.relative, note.acc);
    } else if( interval instanceof Interval){
        // let's hope it's an interval object
        return new Note(note.pos + interval.distance, note.relative, note.acc);
    }
}

/*
 * prototype methods
 */

/**
 * calculates the distance from this note to the specified note
 *
 * @param {Note} note - the note to calculate the distance to
 * @returns {integer}   the distance from this note to the note in semitones
 */
function protoDistance(note){
    return Note.distance( this, note );
}

/**
 * returns the relative distance from this note to note
 *
 * this is an integer from 0 - 11 representing the distance in semitones between
 * the notes
 *
 * @param {Note} note - The second note
 *
 * @returns {integer} The relative distance between the notes in semitones
 */
function protoRelativeDistance(note){
    return Note.relativeDistance( this, note);
}

/**
 *
 * @param {Note} note - The second note
 * @returns {integer} the shortest distance from this to note
 *
 */
function protoShortestDistance (note) {
    return Note.shortestDistance(this, note);
}

function protoShortestRelativeDistance(note){
    return Note.shortestRelativeDistance(this, note);
}

/**
 * get the interval between this note and another
 * @param {Interval} interval - An interval object
 *
 * @returns {Note}
 */
function protoInterval(note){
    return Note.interval( this, note);
};

/**
 *
 * The signature as an integer representing the amount
 * of sharps or flats the scale has when using this
 * note as root.
 *
 * @returns {integer}   The signature as an integer representing the amount
 *                      of sharps or flats the scale has when using this
 *                      note as root.
 */
function protoSignature() {
    return Note.signature( this );
}

/**
 * the Note's position on the circle of fifths
 *
 *
 * @returns {integer}   the position on the circle of fifths as an integer
 *                      ( C = 0, G = 1, D = 2, ... F = -1 )
 */
function protoCofPosition() {
    return Note.cofPosition( this );
}

/**
 * get the proper notation for a note
 *
 * In the end, we use the unicode characters ♭ and ♯ to represent sharps and
 * flats, instead of b or #
 *
 * @param {integer} signature - the amount of sharps of flats
 *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
 *
 * @returns {string} the notation used based on the
 */
function protoNotation(signature) {
    return Note.notation(this, signature);
}

/**
 * get a simple notation for a note, i.e. C#
 *
 * @param {integer} signature - the amount of sharps of flats
 *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
 *
 * @returns {string}
 */
function protoSimpleNotation(signature){
    return Note.simpleNotation(this, signature);
}

/**
 * can this note have the following name?
 *
 * compensates for accidentals, i.e.
 *
 * @returns {boolean} true if the note can be described by this name
 */
function protoHasName(name){
     return Note.fromNotation(name) && this.relPos() == Note.fromNotation(name).relPos();
}

/**
 * the octave the note is in
 *
 * @returns {int} the octave
 */
function protoOctave(){
    return Math.floor(this.pos/12);
}

/**
 * convert the note to a relative note
 *
 * @returns {Note} a new relative Note object
 */
function protoToRelative(){
    return new Note(this.pos - this.octave()*12, true, this.acc);
}

/**
 * return an absolute version of this note, in the specific octave (default = 0)
 * if the note is already absolute (not relative), transpose it to the specified octave
 * @returns {Note}
 */
function protoToAbsolute(octave){
    var o = octave || 0;
    return new Note(this.relPos() + o * 12, false, this.acc);
}

/**
 * get the relative position of the note
 *
 * @returns {integer} the relative position ( 0 - 11 )
 */
function protoRelPos(){
    return this.relative ? this.pos : this.toRelative().pos;
}


/**
 * transpose a note
 *
 * @returns {Note} A new Note object
 */
function protoTranspose(interval){
     return Note.transpose( this, interval );
}

 /**
  * the type of object, always returns "note"
  * @returns {string} "note"
  */
function protoType(){
    return "note";
}

/**
 * returns the frequency (in Hz) of the note
 * in equal temperament
 *
 * use this for sound generation
 *
 * possible optimization: lookup table
 *
 * A4 should be 440Hz
 *
 * @returns {Number} the frequency of the note in Hz
 */
function protoFrequency(){
    return 440 * Math.pow(2, (this.pos-57)/12 );
}

/**
 * isValidNote
 *
 * @param {string} notation - a string notation for a note
 *
 * @returns {boolean} true if the note can be parsed into a Note object
 */
function isValidNote(notation){
    return parseNoteNotation(notation) ? true : false;

}

function parseNoteNotation (notation) {
    if (!notation) return;

    var regex = new RegExp("^" + MUSIQ.NOTE_REGEX + "?$", "m");
    var matches = regex.exec(notation);
    if (!matches) return;

    return {
        note   : matches[1],
        acc    : matches[2],
        octave : matches[3]
    };
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
function isValidNoteList (list) {
    throw new Error('not implemented');
    // split the list
    return false;
}
