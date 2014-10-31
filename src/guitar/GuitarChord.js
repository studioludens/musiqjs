var _ = require('lodash');

'use strict';
/**
 * GuitarChord - a class for representing a guitar chord
 * 
 * 
 * @constructor
 * 
 * @param {Guitar} guitar - a Guitar object on which this chord is played
 * @param {Chord}  chord - a Chord object
 * @param {array}  notes - a collection of GuitarNote objects (optional)
 */

var GuitarChord = function( guitar, chord, notes  ){
    
    this.guitar = guitar;
    this.chord = chord;
    this.notes = notes;
    
    this._barre = 0;
    
    /**
     * how easy it is to play the chord.
     * 
     * these factors add weight:
     * - each note played
     *   + 1 for each note played
     * - the distance of each note relative to the previous note
     *   + 1 for each extra fret distance between two notes
     * - the distance of the note to the base note
     * - the number of fingers used
     *   + 1 for each finger used, + 100 if more than all fingers are used (impossible)
     * 
     * lower is better, no note has ease 0,
     * 1 note at least ease 1
     */
    var ease = 0;
    
    /** 
     * five fingers that we can use
     * 
     * In case you're Django, please remove the last three
     * items from the list 
     * 0 : thumb
     * 1 : index
     * 2 : middle
     * 3 : ring
     * 4 : pinky
     */
    var fingersUsed = [ false, false, false, false, false];
};

/**
 * maximum finger stretch
 */
GuitarChord.MAX_STRETCH = 3;


/**
 * finds all variations of a particular chord with a specific
 * tonic. All these 
 * 
 * @param guitar {Guitar} - the guitar object (with specific tuning)
 * @param chord {Chord} - the Chord object to find specific GuitarChords for
 * @param base {GuitarNote} the Base note we want to base the chord on (GuitarNote)
 * @param options {object} an object specifying more options:
 *                  
 *                      upPreference: false
 *                      maxFingerStretch: 2
 *                      maxDifficulty: 10 
 *                  
 * 
 * @returns {array} an array of GuitarChord objects
 */
GuitarChord.fromChordAndBase = function( guitar, chord, base ){
    
    // from the base, walk up the neck, fret by fret
    
    var baseString = base.stringPos();
    var baseFret = base.fretPos();
    
    var numNotes = chord.notes.length - (chord.optional ? chord.optional.length : 0);
    
    // exit if we have more required notes than possible frets to
    
    
    //var foundNotes = [];
    
    /*
    STEP 0:
    filter out situations where not even all the notes in the chord would fit
    on the selected strings
    */
    if( baseString + numNotes > guitar.strings.length){
        //console.warn( "Not enough strings to find notes on!" + (guitar.strings.length - baseString));
        return;
    }
    
    /*
    STEP 1: 
    create a list for each fret of possible notes within the MAX_STRETCH
    */
    
    var foundNotes = [];
    var chordNotes = chord.notes;
    // push the base note on the return array  
    foundNotes.push( [ base ] );
    
    for( var i = baseString+1; i < guitar.strings.length ; i++){
        // get all notes on the string that match the chord 
        var stringNotes = _(guitar.notes[i]).filter(function(note){
            return _(chordNotes).contains(note.relPos());
        });

        // and are close enough to the base note
        stringNotes = _(stringNotes).filter(function(note){
            if( Math.abs( note.distanceTo(base)[1] ) <= GuitarChord.MAX_STRETCH ){
                //console.log("Found note " + note.simple() + " on pos [" + note.pos + "]");
                return true;
            }
        });
        
        // if we have notes left, these 
        // are potentially interesting
        if( !stringNotes || stringNotes.length == 0 ){
            console.log("No notes on string found!");
        } else if( stringNotes.length == 1 ){
            //console.log("One matching note on string found!");
            //console.log( stringNotes );
            foundNotes.push( stringNotes );
            
        } else {
            // more notes found!
            //console.log( stringNotes.length + " matching note on string found!");
            //console.log( stringNotes );
            
            // for now, return the combined array
            foundNotes.push( stringNotes );
            
        }
    };
    
    var chordNotes = foundNotes;
    // look them up - recursively
    console.log("FoundNotes:");
    console.log(chordNotes);
    
    /* 
    STEP 2:
    Create chords of all possible combinations 
    */
    
    var combinations = function(lists) {
        if (lists.length == 0) {
            return [];
        } else if( lists.length == 1 ){
            return lists[0];
        } else {
            var pr = combinations(_.rest(lists));
            var ret = [];
            _.each(_.first(lists),function(fp) {
                _.each(pr,function(p) {
                    ret.push( [fp].concat(p) );
                });
            });
          return ret;
        }
    };
    
    // array of chords
    var matches = combinations( chordNotes );

    console.log("STEP 2 - # of matches");
    console.log( matches.length );
    
    /*
    STEP 3:
    filter out the chords that don't have all notes
    */
    var matches = _(matches).filter(function(match){
        
        // make a copy for reference
        var remainingNotes = chord.relNotes.slice();
        // loop through all notes of the match
        
        
        // get an array of relative positions
        var relNotes = _(match).map(function(note){
            return note.relPos();
            
        });
        //console.log("relnotes: ", relNotes);
        //console.log( _(remainingNotes).difference(relNotes).length );
        return _(remainingNotes).difference(relNotes).length == 0;
    });
    
    console.log("STEP 3 - # of matches");
    console.log( matches.length );
    
    /*
    STEP 4:
    filter out the chords where the fingers are too far from each other
    */
    var matches = _(matches).filter(function(match){
        
        
        var fretNrs = _(match).map(function(note){
            return note.fretPos();
        });
        
        var lowestFret = _(fretNrs).min();
        var highestFret = _(fretNrs).max();
        
        // we remove all matches where the notes are too far apart
        if( Math.abs(lowestFret - highestFret) > GuitarChord.MAX_STRETCH )
            return false;
        
        
        // now remove all matches where the fingers are too far apart from each other
        // note to note
        for( var i = 1; i < match.length; i++ ){
            if( Math.abs(match[i].fretPos() - match[i-1].fretPos()) > GuitarChord.MAX_STRETCH )
                return false;
        }
        
        console.log("match ", fretNrs );
        return true;
    });
    
    console.log("STEP 4 - # of matches");
    console.log( matches.length );
    
    
    // check if we have found all the notes
    
    // can we calculate this recursively
    return chordNotes;
};

/**
 * finds all variations of a particular chord on the guitar neck
 * 
 * the chord should be relative
 * - find the tonic on each fret
 * 
 * @param guitar {Guitar} - A Guitar object
 * @param chord {Chord} - A chord object
 * 
 * @returns {GuitarChord}
 */
GuitarChord.fromChord = function( guitar, chord ){
    
    if( !chord.relative ){
        console.warn("Relative chord not allowed!");
        return null;
    }
    
    // get all base (lowest) notes
    var baseNotes = [];
    
    // we only have to check the bottom four strings
    
    _(guitar.notes).each(function(string_notes, str_num){
        _(string_notes).each(function(note, fret_num){
            //console.log(note);
            if( chord.contains(note.note) ){
                //console.log(note);
                baseNotes.push( note );
            }
        });
    });
    
    console.log(baseNotes);
    
    // get all possible chord variations for each chord
    return _.compact( _(baseNotes).map(function(base){
        var guitarChord = GuitarChord.fromChordAndBase( guitar, chord, base );
        return guitarChord;
    }));
};

/**
 * check if a guitar chord is valid
 * this is when all notes can be matched
 * with a note in the chord object.
 * 
 * 
 * 
 * @returns {boolean} - true if the chord is valid
 * 
 * @todo implement function
 */
GuitarChord.prototype.valid = function(){
    
};

/**
 * barre - 
 * 
 * @returns {integer}   how many fingers can be played barre. Calculated from the
 *                      top string
 * 
 * @todo test function
 */
GuitarChord.prototype.barre = function(){
    // check highest strings and recurse down, adding as we go
    var same = 0;
    var lastFret = _(this.guitar.frets).last();
    
    _(this.notes).pluck('fret').reverse().each(function(item){
        if( item == lastFret ) same++;
    });
    
    console.log(same);
    return same;
    
};