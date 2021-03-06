'use strict';
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

var Chord = function Chord( notes, descriptor, tonic, relative, type ) {
    
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
Chord.fromNotation = function fromNotation( name, type ){
    
    // check if it's a valid notation, at least the note part
    var matches;
    
    // the array used to look up chords
    var lookup;
    
    var chordType = "";
    
    if( type == 'scale'){
        matches = MUSIQ.isValidScale( name );
        lookup = MUSIQ.scales;
        chordType = 'scale';
        //console.log("Checking Scale");
    } else {
        // default to chord
        matches = MUSIQ.isValidChord( name );
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
    var matchedChords = _(lookup).filter(function(chord){
        return _(chord.names).some(function(name){ return name == notation });
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
                      _(matchedChords[0].notes).union(matchedChords[0].optional).sort(function(a, b) { return a - b; })
                    : matchedChords[0].notes;
    
    var transNotes = _(allNotes).map(function(note){
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
Chord.fromNotes = function fromNotes( notes, inversion ){
    
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
Chord.contains = function contains(chord, note){
    if( chord.relative ){
        return _(chord.relNotes).contains(note.relPos());
    } else {
        return _(chord.notes).contains(note.pos);
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
Chord.prototype.notation = function notation( signature ) {
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
Chord.prototype.longNotation = function longNotation( signature ) {
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
Chord.prototype.transpose = function transpose(interval) {
    // TODO; implement method
    // transpose notes
    this.notes = _(this.notes).map(function(note){
        return note.transpose( interval );
    });
    // transpose tonic
    this.tonic = this.tonic.transpose( interval );
};

/**
 * @returns {array} An array of Note objects, all absolute
 * 
 * save it in a local variable _notes for easy access
 */
Chord.prototype.noteObjects = function(){
    
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
};

/**
 * check if the chord can be described by a simple name
 * 
 * @param {string} name - a possible way to describe the chord, i.e. 'Cmaj', 'D#min'
 *                        'dim', etc.
 *                      - should support both # and b, ♭ and ♯
 * @returns {boolean}   true if the chord can be described by this name
 */
Chord.prototype.hasName = function(name){
    
    // split it between the note and the chord type indicator
    var matches = MUSIQ.isValidChord( name );
    
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
    
    var found = _(this.names).find(function(n){
        return notation === n;
    });
    
    console.log( found );
    
    // NOTE: the _.find() function returns undefined when the item hasn't been found
    return typeof(found) == 'undefined' ? false : true;
};



/**
 * a simple toString function that gives us the notation of all the notes
 * 
 * @returns {string}
 */
Chord.prototype.toString = function(){
    var ret = "[ ";
    _.each(this.notes, function(item){ret += (new Note(item))});
    return ret;
};

/**
 * the minimal notes needed to form this chord
 * @returns {array}   the notes that are minimally necessary
 *                    to form this chord (without optional notes)
 * 
 * 
 */
Chord.prototype.minNotes = function(){
    
    return _(this.notes).filter(function(note){
        return !_(this.optional).contains(note);
    });
}

/**
 * @returns {string} representing the type, can be 'chord', 'scale'
 */
Chord.prototype.type = function(){
    return this._type;
}

/**
 * check if a Chord contains a note
 * 
 * @param {Note} note - a Note object
 * @returns {boolean} true if the chord contains the note
 */
Chord.prototype.contains = function( note ){
    return Chord.contains( this, note );
}


/**
 * the plural class, simply to expose some functions in a more
 * logical way
 * 
 * @class
 */
var Chords = {};

/**
 * build a chord from individual notes
 * these can be note objects or just a list of integers
 * @param {array}   notes         - a simple array of integer notes
 * @param {integer} [inversion=0] - the number of the inversion, 
 *                                  0 = root position, 1 = first inversion, 
 *                                  2 = second inversion, ...
 * 
 * @returns {Chord[]} an array of matching chords, null when nothing is found
 */
Chords.fromNotes = function( notes, inversion ){
    
    var ret = [];
    
    // make a nice array of Note objects from the notes parameter
    var noteObjects = _.map( notes, function(note) {
        return new Note(note);
    });
    
    //console.log( "fromNotes with inversion " + inversion );
    
    if (_.isNumber(inversion) && inversion > -1) {
        // specified an inversion, we first determine the tonic

        // sort the notes from lowest to highest
        var relNotes = notes.slice();

        relNotes.sort(function(a, b) { return a - b; });

        //_.each(relNotes, function(item){console.log((new Note(item).notation()))});
        
        // determine the tonic - the lowest note
        var tonic = relNotes[inversion];

        //var uniqueNotes = _.uniq(relNotes);

        // make the notes relative to the tonic
        relNotes = _.map(relNotes, function(note) {
            return note - tonic;
        });
        
        //console.log(relNotes);
        
        // wrap negative notes
        relNotes = _.map( relNotes, function(note){
            if( note < 0 ){
                // move it enough octaves up
                var n = note - (Math.floor( note / 12 ) * 12);
                console.assert( n >= 0);
                return n;
            } else {
                return note;
            }
        });
        
        //console.log(relNotes);
        
        // now find the chords for all the different possible inversions

        //console.log(relNotes);


        // get the notes within two octaves of the tonic
        var relNotes = _.map(relNotes, function(note) {
            if( note < 0 ) {
                console.log("ERROR: negative note! ");
            }
            else if (note < 12) {
                return note;
            }
            else {
                // filter out special notes, like 9th, 11th and 13th
                var relNote = note % 12;
                if (MUSIQ.chordExtensionNotes.indexOf(relNote) > -1) {
                    return relNote + 12;
                }
                else {
                    return relNote;
                }
            }

        });

        //console.log(relNotes);

        //console.log( relNotes );
        // now remove duplicates
        relNotes = _.uniq(relNotes);
        
        // sort the notes
        relNotes.sort(function(a, b) { return a - b; });

        //console.log(inversion + " : " + " [ " + relNotes + " ]");

        //console.log("Check descriptors");
        
        // find chords in the descriptor list that match
        var matchedChordDescrs = _(MUSIQ.chords).filter(function(chord) {
            
            
            if( chord.optional ){
                // remove all optional notes from the source array
                
                // so we're only left with the absolute required notes to form this chord
                var notesReq = _(relNotes).difference(chord.optional);
                var chordNotesReq = _(chord.notes).difference(chord.optional);
                
                //console.log( notesReq + " - " + chord.notes );
                
                return _(chordNotesReq).isEqual(relNotes ) || _(chordNotesReq).isEqual(notesReq);
            } else {
                return _(chord.notes).isEqual(relNotes);
            }
        }, this);
        
        // filter duplicates
        matchedChordDescrs = _.uniq(matchedChordDescrs);

        var matchedChords = _.map( matchedChordDescrs, function(item){
            // add the matched chords to the return array
            return new Chord(noteObjects, item, new Note(tonic));
        } );
        
        // only log this if we found a matched chord
        if( matchedChords.length > 0){
           // var tonicNote = new Note(tonic);
            
            //console.log(tonicNote.simpleNotation() + " [ " + relNotes + " ]");
            //console.log( "found in inversion " + inversion  + "(" + tonicNote.simpleNotation() + ") - [ " + relNotes + "]");
            //console.log(notes);
            //console.log(relNotes);
        }
        
        //console.log( matchedChords );
        
        return matchedChords;

    }
    // no inversion specified
    else {
        // simple list of chord tonics to check if we have looked for
        // specific chords already
        var chordTonics = [];
        for (var i = 0; i < notes.length; i++) {
            // add matched chords from all inversions of this chord
            var curNote = new Note(notes[i]);
            
            if( chordTonics.indexOf(curNote.toRelative().pos) > -1){
                continue;
            }
            
            chordTonics.push(curNote.toRelative().pos);
            
            var matchedChords = Chords.fromNotes(notes, i);
            
            
            ret = ret.concat(matchedChords);
        }
        
        //console.log( chordTonics);
        
        //console.log( ret );
        
        if( !(ret.length > 0) ){
            //console.log("Chord not found!");
        }
        return ret;
    }
    
};

Chords.fromNotation = Chord.fromNotation;

/**
 * shortcut function to create a new chord based on Chord.fromNotation()
 * 
 * @param {string} name - the name of the chord
 * 
 * @returns {Chord}
 */
function chord( name ){
    return Chord.fromNotation(name );
}