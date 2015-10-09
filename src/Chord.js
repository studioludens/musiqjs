'use strict';

var _     = require('lodash'),
    MUSIQ = require('./base'),
    Note  = require('./Note'),
    Scale = require('./Scale');

module.exports = Chord;

Chord.fromNotation              = fromNotation;
Chord.fromNotes                 = fromNotes;
Chord.contains                  = contains;
Chord.isValidChord              = isValidChord;
Chord.isValidChordList          = isValidChordList;

Chord.prototype.notation        = notation;
Chord.prototype.longNotation    = longNotation;
Chord.prototype.transpose       = transpose;
Chord.prototype.noteObjects     = noteObjects;
Chord.prototype.hasName         = hasName;
Chord.prototype.toString        = toString;
Chord.prototype.minNotes        = minNotes;
Chord.prototype.type            = type;
Chord.prototype.contains        = protoContains;

/**
 * the MUSIQ.js chord class
 *
 * @constructor
 * @param {array} notes - a simple array of integers representing the midi notes
 * @param {object} descriptor - an object describing the chord
 * @param {Note} tonic - the current tonic Note oject
 * @param {boolean} [relative=false] - if the chord should be interpreted as  relative,
 *                   i.e. can be positioned anywhere
 *                   on the musical scale (Fretboard for guitar)
 * @param {string} [type=chord] - the type of chord,
 */
function Chord( notes, descriptor, tonic, relative, type ) {
    
    if( descriptor.hasOwnProperty( 'names') ){
        // notes in relative position
        this.relNotes = descriptor.notes;
        this.names = descriptor.names;
        this.longName = descriptor.longName;
        
        //this.name = this.names[0];
    }
    
    
    this.notes = notes;
    
    
    // if the chord is abstract, it has no tonic.
    this.abstr = (tonic ? false : true);
    
    // if the chord is relative, it can be positioned anywhere
    // on the musical axis
    this.relative = relative || false;
    // override this if the tonic is relative
    this.relative = tonic.relative;
    
    // this should be a Note object
    this.tonic = tonic || new Note(0);
    
    this._type = type || "chord";
};

/**
 * constructs a Chord object from a notation like Cmaj7
 * @param {string} name - the chord name
 * @param {string} [type=chord] - the chord type, can be 'chord' or 'scale'
 * 
 * @returns {Chord}
 */
function fromNotation( name, type ){
    
    // check if it's a valid notation, at least the note part
    var matches;
    
    // the array used to look up chords
    var lookup;
    
    var chordType = "";
    
    if( type == 'scale'){
        matches = Scale.isValidScale( name );
        lookup = MUSIQ.scales;
        chordType = 'scale';
        //console.log("Checking Scale");
    } else {
        // default to chord
        matches = isValidChord( name );
        lookup = MUSIQ.chords;
        chordType = 'chord';
        //console.log("Checking Chord");
    }
    
    //console.log( matches );
    
    // no chord found?
    if( !matches ){
        console.warn("Chord not found : " + name);
        return null;
    }
    
    var tonic = Note.fromNotation( matches[1] + (matches[2] || "") );
    //console.log( tonic );
    var notation = matches[3];
    
    
    if( !notation || notation.length == 0){
        // set the default maj notation
        notation = 'major';
    }
    //console.log( notation );
    
    // this should be only one!
    var matchedChords = _.filter(lookup, function(chord){
        return _.some(chord.names, function(name){ return name == notation });
    });
    
    //console.log("matched chords for " + notation );
    //console.log(matchedChords);
    
    // we should check that the specific notation does not match
    // more than 1 chord. if so, the definition in MUSIQ.chords 
    // contains duplicates
    if( matchedChords.length > 0 ){
        //console.log( "matched Chords > 0! ");
        //console.log(matchedChords);
    }
    console.assert( matchedChords.length == 1);
    
    // get the transposed notes
    
    // first add any optional notes
    var allNotes = matchedChords[0].optional ?
                      _.union(matchedChords[0].notes, matchedChords[0].optional).sort(function(a, b) { return a - b; })
                    : matchedChords[0].notes;
    
    var transNotes = _.map(allNotes, function(note){
        return (new Note(note)).transpose(tonic.pos).relPos();
    })
    
    //console.log("Transnotes:");
    //console.log( transNotes ); 
    
    // find the name in the chord names array
    var chord = new Chord( transNotes, matchedChords[0], tonic, false, chordType );
    
    return chord;
};

/**
 * build a chord from individual notes
 * these can be note objects or just a list of integers
 * @param {array}   notes         - a simple array of integer notes
 * @param {integer} [inversion=0] - the number of the inversion, 
 *                                  0 = root position, 1 = first inversion, 
 *                                  2 = second inversion, ...
 * 
 * @returns {Chord} a matching chord, null when nothing is found
 */
function fromNotes( notes, inversion ){
    
    var matches = Chords.fromNotes( notes, inversion );
    if( matches && matches.length > 0 ){
        return matches[0];
    }
    return null;
};

/**
 * check if this chord contains a certain note
 * 
 * if the Chord is relative, the relative position of the Note is taken
 * 
 * @param {Chord} chord - a Chord object
 * @param {Note} note - a Note object
 * @returns {boolean} true when the Chord contains the specific note
 */
function contains(chord, note){
    if( chord.relative ){
        return _.contains(chord.relNotes, note.relPos());
    } else {
        return _.contains(chord.notes, note.pos);
    }
};

/* instance methods */

/**
 * get the chord in proper notation
 * 
 * these are examples of proper notations:
 * C - an relative C chord
 * C# - a C sharp chord
 * B♭6 - A Bb7 chord
 * Cmin7 - A cminor chord
 * 
 * 
 * @param {integer} signature - the signature of the note
 * @returns {string} - the chord notation as it is most commonly used
 */
function notation( signature ) {
    if( this.abstr ){
        return this.names[0].replace("b","♭").replace("#","♯");;
    } else {
        return this.tonic.simpleNotation( signature ) + this.names[0].replace("b","♭").replace("#","♯");;
    }
};

/**
 * get the name of the chord in long, readable notation
 * 
 * @param {integer} signature - the signature of the note
 */
function longNotation( signature ) {
    if( this.abstr ){
        return this.longName.replace("b","♭").replace("#","♯");;
    } else {
        return this.tonic.simpleNotation( signature ) + " " + this.longName.replace("b","♭").replace("#","♯");;
    }
};

/**
 * transpose a chord with a certain interval and return the new transposed
 * chord
 * 
 * @param {Interval} interval - an Interval object
 * 
 */
function transpose(interval) {
    // TODO; implement method
    // transpose notes
    this.notes = _.map(this.notes, function(note){
        return note.transpose( interval );
    });
    // transpose tonic
    this.tonic = this.tonic.transpose( interval );
}

/**
 * @returns {array} An array of Note objects, all absolute
 * 
 * save it in a local variable _notes for easy access
 */
function noteObjects(){
    
    // just return the simple list of notes
    if( this._notes ) return this._notes;
    
    this._notes =  _.map(  this.relNotes, 
                            function(note){ 
                                //console.log(this.tonic.pos+note);
                                return new Note(this.tonic.pos+note); 
                            }, this );
    //console.log("NoteObjects");
    //console.log(this._notes);
    return this._notes;
}

/**
 * check if the chord can be described by a simple name
 * 
 * @param {string} name - a possible way to describe the chord, i.e. 'Cmaj', 'D#min'
 *                        'dim', etc.
 *                      - should support both # and b, ♭ and ♯
 * @returns {boolean}   true if the chord can be described by this name
 */
function hasName(name){
    
    // split it between the note and the chord type indicator
    var matches = isValidChord( name );
    
    //console.log( matches );
    // if the name is not even valid, return false
    if(!matches ) return false;
    
    // check if the tonic is the same
    if( !this.tonic.hasName( matches[1] + (matches[2] || "") )) return false;
    
    //console.log( tonic );
    
    // if the notation is undefined (from the match), it couldn't be found (no text),
    // but it can still result in a valid chord
    var notation = matches[3] || "";
    
    if( notation === "") 
        console.warn( notation );
    
    // and finally check the notation
    
    var found = _.find(this.names, function(n){
        return notation === n;
    });
    
    console.log( found );
    
    // NOTE: the _.find() function returns undefined when the item hasn't been found
    return typeof(found) == 'undefined' ? false : true;
}



/**
 * a simple toString function that gives us the notation of all the notes
 * 
 * @returns {string}
 */
function toString(){
    var ret = "[ ";
    _.each(this.notes, function(item){ret += (new Note(item))});
    return ret;
}

/**
 * the minimal notes needed to form this chord
 * @returns {array}   the notes that are minimally necessary
 *                    to form this chord (without optional notes)
 * 
 * 
 */
function minNotes(){
    
    return _.filter(this.notes, function(note){
        return !_.contains(this.optional, note);
    });
}

/**
 * @returns {string} representing the type, can be 'chord', 'scale'
 */
function type(){
    return this._type;
}

/**
 * check if a Chord contains a note
 * 
 * @param {Note} note - a Note object
 * @returns {boolean} true if the chord contains the note
 */
function protoContains( note ){
    return Chord.contains( this, note );
}

/**
 *
 * @todo: store these in a static variable when the function is first called
 *
 * @param {string} notation - string notation to check if valid
 *
 * @returns {array} matches from the regular expression if it's a valid chord
 *              0 : the whole matched name
 *              1 : the note
 *              2 : any specified accidentals
 *              3 : chord indicator / name
 */
function isValidChord( notation ){

    if( !notation) return false;

    // default to major
    var not = notation;
    if( !notation || notation.length == 0 ) not = "M";

    // TODO: make this shorter
    /*
     var chordNames =
     _.chain(MUSIQ.chords)
     .pluck("longname")
     .union(
     _.pluck(MUSIQ.chords, "names") )
     .value()
     .join("|");
     */

    var chordNames = _.reduce(MUSIQ.chords, function(memo, item){
        var m = _.isString(memo) ? memo : memo.names.join("|") + "|" + memo.longName;
        //console.log(m);
        return m + "|" + item.names.join("|") + "|" + item.longName;
    });

    var regex = new RegExp("^" + MUSIQ.NOTE_SIMPLE_REGEX + " ?("+ chordNames + ")? ?" + MUSIQ.CHORD_REGEX + "$","m");
    //console.log( regex );
    return regex.exec( not );
}

/**
 * @param {array} list - list of strings with chord names
 * @returns {boolean} true if all chords are valid
 *
 * @todo - implement function
 */
function isValidChordList( list ){
    throw new Error('not implemented');
    // check if the chord name is valid
    return false;
}