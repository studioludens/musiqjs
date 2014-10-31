var _ = require('lodash'),
    defs = require('./defs'),
    validators = require('./validators'),
    Interval = require('./interval');

/**
 * the musiq.js Note object
 * 
 * @constructor
 * @param {int} pos - the midi position of the note
 * @param {boolean} relative - a boolean, true if the note is relative (it doesn't have
 *                   an octave). if relative is true, pos should not be larger
 *                   than 12
 */
var Note = function( pos, relative ){
    this.pos = pos;
    this.relative = relative || false;
    
    // if the note is relative, decrease the position to fall inbetween
    // 0 <= pos < 12
    if( this.relative ){
        this.pos = this.pos % 12;
    }
};

/**
 * static Note methods
 */
var staticMethods = {
    /**
     * get a new note object from a string notation
     *
     * @param {string} notation - in the form C4, Bb6 etc
     where the number is the octave
     this should also match lowerCase notations

     * @returns {Note} a note object or null, when no note could be found
     */
    fromNotation: function( notation ){

        var ret;
        // split the notation
        if( !notation ) return;

        var matches = validators.isValidNote( notation );

        //console.log( "Note.fromNotation matches : " + notation );
        //console.log( matches );

        // no chord found?
        if( !matches ){
            console.warn("Note not found : " + name);
            return;
        }

        var note = matches[1];
        var acc = (matches[2] || "").replace("♭","b").replace("♯","#");
        var octave = +matches[3] || 0 ;


        // convert octave to integer, defaulting on 0 (if parsing fails)

        // if no octave is specified
        // but if a 0 is explicitly mentioned (like in C0)
        // it's not a relative note

        var relative = octave < 1;
        if( matches[3] === "0" ) relative = false;

        //console.log(" Note " + notation + " octave = " + octave + ", relative = " + relative + ", acc = " + acc);

        // just one note
        //console.log(items);

        // get note position
        var nn = note.toUpperCase();
        var npos = defs.notePositions[ defs.noteNames.indexOf( nn ) ];

        //console.log( npos );

        // get accidental position
        acc = defs.accidentals.indexOf( acc ) - 3;

        // error case
        if( acc < -3 || _.isUndefined(npos) || npos < 0 ){
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

    },

    /**
     * make a note object from a position
     *
     * @param {int} pos - the midi position of the note
     *
     * @returns {Note}
     */
    fromPos: function( pos ){
        //console.log( pos );
        return new Note( pos );
    },

    /**
     * the distance (in semitones) to another note
     * this is the number notation of the interval
     *
     * @param {Note} note1 - The first note
     * @param {Note} note2 - The second note
     * @returns {int} The distance between the notes in semitones
     */
    distance: function( note1, note2 ){
        return note2.pos - note1.pos;
    },

    /**
     * returns the relative distance from note1 to note2
     *
     * this is an integer from 0 - 11 representing the distance in semitones between
     * the notes
     *
     * @param {Note} note1 - The first note
     * @param {Note} note2 - The second note
     *
     * @returns {int} The relative distance between the notes in semitones
     */
    relativeDistance: function( note1, note2 ){
        var rel = note2.toRelative().pos - note1.toRelative().pos;
        return ( rel < 0 ) ? rel + 12 : rel;
    },

    /**
     *
     * @param {Note} note1 - The first note
     * @param {Note} note2 - The second note
     * @returns {int} the shortest distance from note1 to note2
     *
     * @todo - implement function
     *
     */
    shortestDistance: function( note1, note2 ){
        return 0;
    },

    /**
     * @returns {int} the shortest relative distance
     *
     * @todo - implement function
     */
    shortestRelativeDistance: function( note1, note2 ){
        return 0;
    },

    /**
     * the interval between the notes
     *
     * @param {Note} note1 - The first note
     * @param {Note} note2 - The second note
     * @returns {Interval} The interval between the notes
     */
    interval: function( note1, note2 ){
        return new Interval( Note.distance(note1, note2) );
    },

    /**
     *
     * The signature as an integer representing the amount
     * of sharps or flats the scale has when using this
     * note as root.
     *
     * @param {Note} note - a Note object
     *
     * @returns {int}   The signature as an integer representing the amount
     *                      of sharps or flats the scale has when using this
     *                      note as root.
     */
    signature: function( note ){
        return defs.signatures[note.toRelative().pos];
    },

    /**
     * the Note's position on the circle of fifths
     *
     * @param {Note} note - a Note object
     *
     * @returns {int}   the position on the circle of fifths as an integer
     *                      ( C = 0, G = 1, D = 2, ... F = -1 )
     */
    cofPosition: function( note ){
        return defs.cofPositions[note.toRelative().pos];
    },

    /**
     * get the proper notation for a note
     *
     * In the end, we use the unicode characters ♭ and ♯ to represent sharps and
     * flats, instead of b or #
     *
     * @param {Note} note - A Note object
     * @param {int} signature - the amount of sharps of flats
     *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
     *
     * @returns {string} the notation used based on the
     */
    notation: function( note, signature ){

        // check flat
        var ret = "";

        if( Note.signatureIsFlat( signature ) ){
            ret = defs.flatNames[note.relPos()] + (!note.relative ? note.octave() : "");
        } else {
            ret = defs.sharpNames[note.relPos()] + (!note.relative ? note.octave() : "");
        }

        // experimental : replace b with ♭ and # with ♯
        // should probably check for unicode support?
        return ret.replace("b","♭").replace("#","♯");

    },

    /**
     * get a simple notation for a note, i.e. C#
     *
     * @param {Note} note - A note object
     * @param {int} signature - the amount of sharps of flats
     *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
     *
     * @returns {string}
     */
    simpleNotation: function( note, signature ){

        var n = note;
        var ret;

        if( !(note instanceof Note) ) n = new Note(note);

        if( Note.signatureIsFlat( signature ) ){
            ret = defs.flatNames[n.relPos()];
        } else {
            ret = defs.sharpNames[n.relPos()];
        }

        // experimental : replace b with ♭ and # with ♯
        // should probably check for unicode support?
        return ret.replace("b","♭").replace("#","♯");
    },

    /**
     * checks if a signature is flat
     *
     * @param {boolean|int} signature - the signature ( if an integer, )
     *
     * @returns {boolean} true if the signature is flat (one or more b)
     */
    signatureIsFlat: function( signature ){
        //var sig = 0;
        if(_.isUndefined(signature))
            return false; // default to C (no sharps or flats)
        else if( _.isBoolean(signature) )
            return signature; // if signature is a boolean
        else
            return signature < 0;
        // return true  if the signature is lower than 0

    },

    /**
     * transpose a note with an interval
     * @param {Note} note - A note object
     * @param {Interval} interval - An interval object
     */
    transpose: function( note, interval ){
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

};

Note = _.extend(Note, staticMethods);

/*
 * class methods
 */
var notePrototype = {
    /**
     * calculates the distance from this note to the specified note
     *
     * @param {Note} note - the note to calculate the distance to
     * @returns {int}   the distance from this note to the note in semitones
     */
    distance: function( note ){
        return Note.distance( this, note );
    },

    /**
     * returns the relative distance from this note to note
     *
     * this is an integer from 0 - 11 representing the distance in semitones between
     * the notes
     *
     * @param {Note} note - The second note
     *
     * @returns {int} The relative distance between the notes in semitones
     */
    relativeDistance: function( note ){
        return Note.relativeDistance( this, note);
    },

    /**
     *
     * @param {Note} note - The second note
     * @returns {int} the shortest distance from this to note
     *
     */
    shortestDistance: function( note ){
        return Note.shortestDistance( this, note);
    },

    /**
     * transpose the note with an interval
     * @param {Interval} interval - An interval object
     *
     * @returns {Note}
     */
    interval: function( interval ){
        return Note.interval( this, interval);
    },

    /**
     *
     * The signature as an integer representing the amount
     * of sharps or flats the scale has when using this
     * note as root.
     *
     * @returns {int}   The signature as an integer representing the amount
     *                      of sharps or flats the scale has when using this
     *                      note as root.
     */
    signature: function() {
        return Note.signature( this );
    },

    /**
     * the Note's position on the circle of fifths
     *
     *
     * @returns {int}   the position on the circle of fifths as an integer
     *                      ( C = 0, G = 1, D = 2, ... F = -1 )
     */
    cofPosition: function() {
        return Note.cofPosition( this );
    },

    /**
     * get the proper notation for a note
     *
     * In the end, we use the unicode characters ♭ and ♯ to represent sharps and
     * flats, instead of b or #
     *
     * @param {int} signature - the amount of sharps of flats
     *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
     *
     * @returns {string} the notation used based on the
     */
    notation: function(signature) {
        return Note.notation(this, signature);
    },

    /**
     * get a simple notation for a note, i.e. C#
     *
     * @param {int} signature - the amount of sharps of flats
     *                              (0 = no sharps / flats, 1 = 1 sharp, -1 = 1 flat, etc.)
     *
     * @returns {string}
     */
    simpleNotation: function(signature){
        return Note.simpleNotation(this, signature);
    },

    /**
     * can this note have the following name?
     *
     * compensates for accidentals, i.e.
     *
     * @returns {boolean} true if the note can be described by this name
     */
    hasName: function( name ){
        return Note.fromNotation(name) && this.relPos() === Note.fromNotation(name).relPos();
    },

    /**
     * the octave the note is in
     *
     * @returns {int} the octave
     */
    octave: function( ){
        return Math.floor(this.pos/12);
    },

    /**
     * convert the note to a relative note
     *
     * @returns {Note} a new relative Note object
     */
    toRelative: function( ){
        return new Note(this.pos - this.octave()*12);
    },

    /**
     * get the relative position of the note
     *
     * @returns {int} the relative position ( 0 - 11 )
     */
    relPos: function(){
        return this.relative ? this.pos : this.toRelative().pos;
    },


    /**
     * transpose a note
     *
     * @returns {Note} A new Note object
     */
    transpose: function( interval ){
        return Note.transpose( this, interval );
    },

    /**
     * the type of object, always returns "note"
     * @returns {string} "note"
     */
    type: function(){
        return "note";
    },

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
    frequency: function(){
        return 440 * Math.pow(2, (this.pos-69)/12 );
    }
};

Note.prototype = notePrototype;

/**
 * creates a note object from a notation. This is the same as saying
 * Note.fromNotation( )
 * @param {String} notation - a string notation of the note
 *
 * @returns {Note}
 */
function note( notation ){
    return Note.fromNotation( notation );
}

module.exports = Note;