'use strict';

var _            = require('lodash'),
    MUSIQ        = require('../MUSIQ'),
    Chord        = require('../Chord'),
    Chords       = require('../Chords'),
    GuitarFret   = require('./GuitarFret'),
    GuitarNote   = require('./GuitarNote'),
    GuitarString = require('./GuitarString'),
    GuitarChord  = require('./GuitarChord');

module.exports = Guitar;

Guitar.prototype.createNotes            = createNotes;
Guitar.prototype.tuning                 = tuning;
Guitar.prototype.chordsFromFingerPos    = chordsFromFingerPos;
Guitar.prototype.chordFromFingerPos     = chordFromFingerPos;
Guitar.prototype.chordsFromActiveNotes  = chordsFromActiveNotes;
Guitar.prototype.activeMatches          = activeMatches;
Guitar.prototype.activeNotes            = activeNotes;

Guitar.prototype.notesFromFingerPos     = notesFromFingerPos;
Guitar.prototype.posFromChord           = posFromChord;
Guitar.prototype.notesOnFret            = notesOnFret;
Guitar.prototype.notesOnString          = notesOnString;
Guitar.prototype.noteOnPos              = noteOnPos;
Guitar.prototype.notationFor            = notationFor;
Guitar.prototype.transpose              = transpose;
Guitar.prototype.show                   = show;
Guitar.prototype.showNotes              = showNotes;
Guitar.prototype.showChords             = showChords;
Guitar.prototype.showScales             = showScales;
Guitar.prototype.showTonic              = showTonic;
Guitar.prototype.showFrets              = showFrets;
Guitar.prototype.clearFretboard         = clearFretboard;

//
/**
 *
 * Guitar object
 * 
 * 
 * @constructor
 * 
 * @param {string}  [tuning=standard] - initializes the guitar object with a tuning
 *                  defaults to "standard" guitar tuning
 *                  E A D G B E
 *                  
 * 
 * You can find more tunings in MUSIQ.tunings
 * 
 */
function Guitar( tuning ){
    
    // strings get initialized when a tuning is set
    this.strings = [];
    
    // the strings property of the guitar object is
    // automatically set when the tuning is set
    this.tuning( tuning || "standard" );
    
    // get number of frets shown - set to default
    this.FRETS_SHOWN = Guitar.FRETS_SHOWN;
    
    // initialize frets
    this.frets = [];
    for( var i = 0; i < this.FRETS_SHOWN; i++){
        // for now initialize with empty notes
        // fill the fret with data!
        this.frets[i] = new GuitarFret( this, i );
    }

    this.createNotes();

    //console.log( this );
};

/**
 * An object array with a number of different guitar tunings.
 * @todo add more tunings
 * 
 */
Guitar.tunings = {
    "standard" : {
        "name"    : "Standard",
        "notes"   : [ 40, 45, 50, 55, 59, 64 ]
    },
    "drop d"   : {
        "name"    : "Drop D",
        "notes" : [ 38, 45, 50, 55, 59, 64 ]
    },
    "open g"   : {
        "name"    : "Open G",
        "notes" : [ 38, 43, 50, 55, 59, 62 ]
    },
    "fourths"   : {
        "name"    : "All Fourths",
        "notes" : [ 40, 45, 50, 55, 60, 65 ]
    },
    "ukelele"   : {
        "name"    : "Ukelele Standard",
        "notes" : [ 67, 60, 64, 69 ]
    }
}

/**
 * the number of frets shown in any visual representation (default value = 16 )
 */
Guitar.FRETS_SHOWN = 16;

/**
 * @private
 */
function createNotes(){
    
    // create an matrix of notes:
    this.notes = _.map(this.strings, function( str, str_nr ){
       return _.map(this.frets, function( fret, fret_nr ){
           if( this.notes[str_nr] && this.notes[str_nr][fret_nr]){
               // change the guitar note
               this.notes[str_nr][fret_nr].note.pos = str.base + fret_nr;
               // and return the original
               return this.notes[str_nr][fret_nr];
           } else {
               return new GuitarNote( this, str, fret, [str_nr, fret_nr] );
           } 
       }, this);
    }, this);
}
/**
 * sets or gets the tuning for this guitar
 * @param {string} name - representing the type of tuning (default: "standard")
 * 
 * @returns {Guitar} this object
 */
function tuning( name ){
    
    // just return the current tuning if it's not set
    if( !name ) return this._tuning;
    
    this._tuning = Guitar.tunings[name];
    
    // check if we have a good tuning?
    if(!this._tuning){
        console.warn("Tuning not found! " + name);
        return;
    }
    
    // we have a tuning, set up the strings and frets
    
    // set strings
    this.strings = _.map(this._tuning.notes, function(item, key){
        // using 'this' here returns a Window object!
        return new GuitarString( this, key, item);
    }, this);
    
    // re-create notes
    this.createNotes();
    
    //console.log(this.strings);
    return this._tuning;
}

/**
 * returns a list of chords based on the finger positions for the 
 * individual strings
 * @param {array} positions - the finger positions on the individual strings
 * @returns {Chord[]} an array of chords that match this fingering position
 * 
 */
function chordsFromFingerPos( positions ){
    return Chords.fromNotes( this.notesFromFingerPos( positions ) );
}

/**
 * returns one chord based on the finger positions for the 
 * individual strings
 * 
 * @param {integer[]} positions - the finger positions on the individual strings
 *                                -1 represents 
 * @returns {Chord} a chord object that matches this fingering position. If no 
 *                                chord is found, null is returned. 
 * 
 * 
 */
function chordFromFingerPos( positions ){
    return Chord.fromNotes( this.notesFromFingerPos( positions ) );
}

/**
 * @returns {array} an array of Chord objects from the active notes played on the guitar
 */
function chordsFromActiveNotes(){
    var notes = _.map(this.activeNotes(), function(note){
            return note.notePos();
        });
    
    //console.log(notes);
    return Chord.fromNotes( notes );
}

/**
 * @returns {Note[]|Chord[]} a match array with Note objects that
 * match this finger position
 */
function activeMatches(){
    // get all notes
    var notes = _.map(this.activeNotes(), function(note){
            return note.notePos();
        });
    
    
    var matchedChords = Chords.fromNotes( notes );
    if( !matchedChords ){
        // just return the individual notes as an array
        return _.map(this.activeNotes(), function(note){
            return note.note; // because it's a GuitarNote
        });
    }
    return matchedChords;
}

/**
 * @returns {GuitarNote[]} of GuitarNote objects representing
 * all the active notes on the guitar neck
 */
function activeNotes(){
    var activeNotes = [];
    
    _.each(this.notes, function(string_notes){
        _.each(string_notes, function(note){
            if( note.active() ) activeNotes.push(note);
        });
    });
    
    return activeNotes;
    
    //console.log(activeNotes);
}

/**
 * @returns {integer[]} a list of integers representing the MIDI notes for all finger positions 
 */
function notesFromFingerPos( positions ){
    
    var notes = [];
    
    _.each(positions, function( fret, str ){
        
        if( fret > -1 ) {
            notes.push ( this.notes[str][fret].note.pos );
            //console.log( this.notes[str][fret].note.simpleNotation() );
        }
    }, this);

    //console.log( notes );
    
    return notes;
}

/**
 * get all possible fingering positions from a chord
 * @returns {array} an array with all possible fingerings
 * 
 * @todo implement this method
 */
function posFromChord( chord ){
    
}

/**
 * get all notes on a particular fret
 * @param {integer} fretNr - the number of the fret to look for
 * 
 * @returns {GuitarNote[]} an array of GuitarNote objects
 */
function notesOnFret( fretNr ){
    return _.map(this.strings, function( str, str_nr ){
        return this.notes[str_nr][fretNr];
    }, this);
}

/**
 * get all notes on a particular string
 * @param {integer} stringNr - the the number of the string to look for
 * 
 * @returns {GuitarNote[]} an array of GuitarNote objects
 */
function notesOnString( stringNr ){
    return this.notes[stringNr];
}

/**
 * get the note on a specific position on the fretboard
 * @param {integer[]} pos - an array like [ string, fret ]
 * 
 * @returns {GuitarNote}
 */
function noteOnPos( pos ){
    return this.notes[ pos[0] ][ pos[1] ];
}

/**
 * get the notation for a note on the specified string and fret
 * @returns {string} the notation for a position on the fretboard
 * @param {integer} str - the string selected (int)
 * @param {integer} fret - the selected fret (int)
 */
function notationFor( str, fret ){
    return this.notes[str][fret].note.simpleNotation();
}


/**
 * transpose notes on the fretboard
 * @param {integer} num - the number of frets to transpose (negative is down, positive is up)
 * 
 * @returns {Guitar} the Guitar object
 * 
 * we implement this by transposing the state objects of all the notes only
 */
function transpose( num ){
    
    // get a matrix of copies of all the state objects
    var so = _.map(this.notes, function(string_notes){
        return _.map(string_notes, function(note){
            return _.clone(note.state);
        });
    });
    
    
    
    // assign the state objects to their new notes
    _.each(this.notes, function(string_notes, str_num){
        _.each(string_notes, function(note, fret_num){
            
            var newfret = fret_num - num;
            if( newfret > -1 && newfret < Guitar.FRETS_SHOWN ){
                //console.log( "copying state: " + newfret);
                note.state = so[str_num][newfret];
            } else {
                // revert to default state
                note.state = _.clone(GuitarNote.DEFAULT_STATE);
            }
                
        });
    });
    
    return this;
}


/**
 * show function: shows chords, notes or scales on the fretboard
 * 
 * @param matches {array} - an array of Chord / Note / Scale objects to be shown
 * 
 * @return {Guitar} - the Guitar object
 * 
 */
 
function show( matches ){
    
    if( !matches ) return this;
    
    // clear fretboard
    this.clearFretboard();
    
    /**
     * show the first match bright, the second and later
     * matched slightly faded (ghosted) and the notes matched
     * as tonic
     */
    _.each(matches, function(match, num){
        
        console.log(num);
        // options
        var o = { only: true, active: true, ghosted: num > 0 };
        
        if( match.type() == 'note'){
            this.showNotes( [match], o);
            o.tonic = true;
        } else if( match.type() == 'chord' || match.type() == 'scale' ){
            this.showChords( [match], o );
        } 
        
    },this);
    
    return this;
    
}

/**
 * show all the notes on the fretboard that match a
 * particular array of basic notes
 * 
 * @param notes {array} - array with notes
 * @param options {object} - object describing some formatting options:
 * 
 *         only: boolean,
 *          active: boolean,
 *          ghosted: boolean,
 *          tonic: boolean
 *  
 * @returns {Guitar} the Guitar object
 * 
 */
function showNotes( notes, options ){
    
    console.log( "ShowNotes ");
    //console.log( notes )
    
    // set the default options
    var opts = options || { only : true, active: true };
    
    //console.log( notes );
    // convert it to an array of note objects
    
    // TODO: probably solve this with reduce
    var noteObjects = _.map(notes, function(n){
            if( n instanceof Note){
                return n;
            // check if N is a number
            } else if( _.isNumber(n) ){
                
                //console.log("Note is number : " + n);
                
                // relative
                if( n < 12 ){
                    return new Note(n, true); // return a relative note
                } else {
                    // absolute
                    return new Note(n);
                }
            // check if N is a string
            } else if( _.isString(n) ){
                // convert it to a note
                //console.log("Note is string : " + n);
                return Note.fromNotation(n);
            }
            // no match
            // return nothing
            console.log("Note not recognized! ");
            console.log(n);
            return;
        });
    
    console.log( noteObjects );
    
    _.each(this.notes, function(string_notes){
        _.each(string_notes, function(note){
            
            // note is a GuitarNote object
            
            var noteFound = _.find(noteObjects, function(n){
                // check if n and note are the same
                if( !n ) return false;
                //console.log( n.relative );
                
                if( n.relative ){
                    if( note.relativeNotePos() == n.pos ) return true;
                } else {
                    if( note.notePos() == n.pos ) return true;
                }
                return false;
            } );
            
            //console.log( "Note match! " + note.notation() );
            // set each note active that matches with one of the notes in the
            // @notes parameter
            
            // the only parameter defines if we should activate only the matched
            // chords
            if( opts.only ) note.active( noteFound );
            else 
                if( noteFound ) note.active( noteFound );
            
            if( opts.active ) note.active( noteFound );
            
            if( opts.tonic ) note.tonic( noteFound );
            
            if( opts.ghosted ) note.ghosted( noteFound );
        });
    });
    
    return this;
}

/**
 * show all the notes of a list of chords on the fretboard
 * 
 * @param {array} - array of Chord objects
 * 
 * @returns {Guitar} the Guitar object
 * @todo: implement so we can show multiple chords. Now, it will only show the
 * first chord in the array
 * 
 */
function showChords( chords ){
    
    console.log( "ShowChords ");
    console.log( chords );
    
    // get a list of notes - only from the first chord
    if( chords && chords.length > 0){
        this.showNotes( chords[0].notes );
        
        // set the tonic
        this.showTonic( chords[0].tonic );
    }
    
    return this;
}

/**
 * show all notes of a particular scale on the fretboard
 * 
 * @param scales {array} - of Scale objects
 * @returns {Guitar} the Guitar object
 * 
 * @todo implement function
 */
function showScales( scales ){
    console.log("Function showScales not implemented!");
    return this;
}

/**
 * show the tonic notes on the fret board as well
 * @param note {Note} - a Note object representing the current tonic
 * 
 * @returns {Guitar} the Guitar object
 */
function showTonic( note ){
    console.log("Showing tonic");
    console.log( note );
    
    return this.showNotes( [note], { only: false, tonic: true });
}

/**
 * show the notes on the fretboard
 * @param frets {array} - an array of integers representing which note to show
 *                on what string
 * @returns {Guitar} the Guitar object
 */
function showFrets( frets ){
   
   _.each(this.notes, function( string_notes, key ){
       if( frets[key] > -1 ){
           string_notes[frets[key]].active(true);
       };
   });
   
   return this;
   
}

/**
 * clear all active or ghosted notes from the fretboard
 * 
 * @returns {Guitar} the Guitar object
 */
function clearFretboard(){
    
    _.each(this.notes, function(string_notes){
        _.each(string_notes, function(note){
            note.state = { active: false, ghosted: false, root: false };
        });
    });
    
    return this;
    
}