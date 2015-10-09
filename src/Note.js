'use strict';

var _ = require('lodash'),
    MUSIQ = require('./base'),
    Interval = require('./Interval');

module.exports = Note;

Note.fromNotation               = fromNotation;
Note.fromPos                    = fromPos;
Note.distance                   = distance;
Note.relativeDistance           = relativeDistance;
Note.shortestDistance           = shortestDistance;
Note.shortestRelativeDistance   = shortestRelativeDistance;
Note.interval                   = interval;
Note.signature                  = signature;
Note.cofPosition                = cofPosition;
Note.notation                   = notation;
Note.simpleNotation             = simpleNotation;
Note.signatureIsFlat            = signatureIsFlat;
Note.transpose                  = transpose;
Note.isValidNote                = isValidNote;
Note.isValidNoteList            = isValidNoteList;

Note.prototype.distance         = protoDistance;
Note.prototype.relativeDistance = protoRelativeDistance;
Note.prototype.shortestDistance = protoShortestDistance;
Note.prototype.interval         = protoInterval;
Note.prototype.signature        = protoSignature;
Note.prototype.cofPosition      = protoCofPosition;
Note.prototype.notation         = protoNotation;
Note.prototype.simple           = protoSimpleNotation;
Note.prototype.simpleNotation   = protoSimpleNotation;
Note.prototype.hasName          = protoHasName;
Note.prototype.octave           = protoOctave;
Note.prototype.toRelative       = protoToRelative;
Note.prototype.rel              = protoToRelative;
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
 */
function Note( pos, relative ){
    this.pos = pos;
    this.relative = relative || false;
    
    // if the note is relative, decrease the position to fall inbetween
    // 0 <= pos < 12
    if( this.relative ){
        this.pos = this.pos % 12;
    }
}


 /**
  * get a new note object from a string notation
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
    
    var matches = isValidNote( notation );
    
    //console.log( "Note.fromNotation matches : " + notation );
    //console.log( matches );
    
    // no chord found?
    if( !matches ){
        console.warn("Note not found : " + name);
        return;
    }
    
    var note = matches[1];
    var acc = (matches[2] || "").replace("♭","b").replace("♯","#");;
    var octave = +matches[3] || 0 ;
    
    
    // convert octave to integer, defaulting on 0 (if parsing fails)
    
    // if no octave is specified
    // but if a 0 is explicitly mentioned (like in C0)
    // it's not a relative note
    
    var relative = octave < 1;
    if( matches[3] == "0" ) relative = false;
    
    //console.log(" Note " + notation + " octave = " + octave + ", relative = " + relative + ", acc = " + acc);
    
    // just one note
    //console.log(items);
    
    // get note position 
    var nn = note.toUpperCase();
    var npos = MUSIQ.notePositions[ MUSIQ.noteNames.indexOf( nn ) ];
    
    //console.log( npos );
    
    // get accidental position
    var acc = MUSIQ.accidentals.indexOf( acc ) - 3;
    
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
    ret = new Note( finalPos, relative );
    
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
    return new Note( pos );
}


/**
 * the distance (in semitones) to another note
 * this is the number notation of the interval
 * 
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {integer} The distance between the notes in semitones
 */
function distance( note1, note2 ){
  return note2.pos - note1.pos;  
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
function relativeDistance( note1, note2 ){
  var rel = note2.toRelative().pos - note1.toRelative().pos;
  return ( rel < 0 ) ? rel + 12 : rel;
}

/**
 * 
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {integer} the shortest distance from note1 to note2
 * 
 * @todo - implement function
 *
 */
function shortestDistance( note1, note2 ){
    return 0;
}

/**
 * @returns {integer} the shortest relative distance
 * 
 * @todo - implement function
 */
function shortestRelativeDistance( note1, note2 ){
    return 0;
}


/**
 * the interval between the notes
 * 
 * @param {Note} note1 - The first note
 * @param {Note} note2 - The second note
 * @returns {Interval} The interval between the notes
 */
function interval( note1, note2 ){
    return new Interval( Note.distance(note1, note2) );
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
function signature( note ){
    return MUSIQ.signatures[note.toRelative().pos];
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
function notation( note, signature ){
    
    // check flat
    var ret = "";
    
    if( Note.signatureIsFlat( signature ) ){
        ret = MUSIQ.flatNames[note.relPos()] + (!note.relative ? note.octave() : "");
    } else {
        ret = MUSIQ.sharpNames[note.relPos()] + (!note.relative ? note.octave() : "");
    }
    
    // experimental : replace b with ♭ and # with ♯
    // should probably check for unicode support?
    return ret.replace("b","♭").replace("#","♯");
    
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
function simpleNotation( note, signature ){
   
   var n = note;
   var ret;
   
   if( !(note instanceof Note) ) n = new Note(note);
   
   if( Note.signatureIsFlat( signature ) ){
        ret = MUSIQ.flatNames[n.relPos()];
    } else {
        ret = MUSIQ.sharpNames[n.relPos()];
    } 
    
    // experimental : replace b with ♭ and # with ♯
    // should probably check for unicode support?
    return ret.replace("b","♭").replace("#","♯");
}

/**
 * checks if a signature is flat
 * 
 * @param {boolean|integer} signature - the signature ( if an integer, )
 * 
 * @returns {boolean}   True if the signature is flat (one or more b)
 */
function signatureIsFlat( signature ){
    //var sig = 0;
    if( typeof signature == "undefined")
        return false; // default to C (no sharps or flats)
    else if( _.isBoolean(signature) )
        return signature; // if signature is a boolean
    else
        return signature < 0;
    // return true  if the signature is lower than 0
    
}



/**
 * transpose a note with an interval
 * @param {Note} note - A note object
 * @param {Interval} interval - An interval object
 */
function transpose( note, interval ){
    // check if it's an interval object
    if( _.isNumber(interval) ){
        return new Note(note.pos + interval);
    } else if(_.isString(interval) ) {
        return new Note(note.pos + Interval.fromName(interval).distance);
    } else {
        // let's hope it's an interval object
        return new Note(note.pos + interval.distance);
    }
}


/*
 * class methods
 */
 
/**
 * calculates the distance from this note to the specified note
 * 
 * @param {Note} note - the note to calculate the distance to
 * @returns {integer}   the distance from this note to the note in semitones
 */
function protoDistance( note ){
    return Note.distance( this, note );
};

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
function protoRelativeDistance( note ){
    return Note.relativeDistance( this, note);
}

/**
 * 
 * @param {Note} note - The second note
 * @returns {integer} the shortest distance from this to note
 *
 */
function protoShortestDistance( note ){
    return Note.shortestDistance( this, note);
}

/**
 * transpose the note with an interval
 * @param {Interval} interval - An interval object
 * 
 * @returns {Note}
 */
function protoInterval( interval ){
    return Note.interval( this, interval);
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
function protoHasName( name ){
     return Note.fromNotation(name) && this.relPos() == Note.fromNotation(name).relPos();
}

/**
 * the octave the note is in
 * 
 * @returns {integer} the octave
 */
function protoOctave( ){
    return Math.floor(this.pos/12);
}

/**
 * convert the note to a relative note
 * 
 * @returns {Note} a new relative Note object
 */
function protoToRelative( ){
    return new Note(this.pos - this.octave()*12);
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
function protoTranspose( interval ){
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
 * @returns {Number} the frequency of the note in Hz
 */
function protoFrequency(){
    return 440 * Math.pow(2, (this.pos-69)/12 );
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
    throw new Error('not implemented');
    // split the list
    return false;
}
