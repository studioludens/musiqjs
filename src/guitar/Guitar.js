// guitar class
// abstracts a guitar

var Guitar = function( tuning ){
    
    
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
    }
};

Guitar.FRETS_SHOWN = 16;

Guitar.prototype.createNotes = function(){
    
    // create an matrix of notes:
    this.notes = _( this.strings ).map( function( str, str_nr ){
       return _( this.frets ).map( function( fret, fret_nr ){
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
 * @param name : a string representing the type of tuning (default: "standard")
 */
Guitar.prototype.tuning = function( name ){
    
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
};



/**
 * returns a list of chords based on the finger positions for the 
 * individual strings
 * @param positions : the finger positions on the individual strings
 * @returns an array of chords that match this fingering position
 * 
 */
Guitar.prototype.chordsFromFingerPos = function( positions ){
    
    var notes = this.notesFromFingerPos( positions );
    
    return Chord.fromNotes( notes );
    
};

/**
 * returns a Chord object from the active notes played on the guitar
 */
Guitar.prototype.chordsFromActiveNotes = function(){
    var notes = _(this.activeNotes()).map(function(note){
            return note.notePos();
        });
    
    console.log(notes);
    return Chord.fromNotes( notes );
};




/**
 * returns an array of GuitarNote objects representing
 * all the active notes on the guitar neck
 */
Guitar.prototype.activeNotes = function(){
    var activeNotes = [];
    
    _(this.notes).each(function(string_notes){
        _(string_notes).each(function(note){
            if( note.active() ) activeNotes.push(note);
        });
    });
    
    return activeNotes;
    
    //console.log(activeNotes);
};

/**
 * @returns a list of Note objects 
 */
Guitar.prototype.notesFromFingerPos = function( positions ){
    
    var notes = [];
    
    _( positions ).each( function( fret, str ){
        
        if( fret > -1 ) {
            notes.push ( this.notes[str][fret].note.pos );
            //console.log( this.notes[str][fret].note.simpleNotation() );
        }
    }, this);

    //console.log( notes );
    
    return notes;
};

/**
 * get all possible fingering positions from a chord
 * @returns an array with all possible fingerings
 */
Guitar.prototype.posFromChord = function( chord ){
    
};

/**
 * get all notes on a particular fret
 * @param fretNr : the number of the fret to look for
 */
Guitar.prototype.notesOnFret = function( fretNr ){
    return _(this.strings).map( function( str, str_nr ){
        return this.notes[str_nr][fretNr];
    }, this);
};

/**
 * @returns the notation for a position on the fretboard
 * @param str : the string selected (int)
 * @param fret : the selected fret (int)
 */
Guitar.prototype.notationFor = function( str, fret ){
    return this.notes[str][fret].note.simpleNotation();
};


/**
 * transpose notes on the fretboard
 * @param num : the number of frets to transpose (negative is down, positive is up)
 * 
 * we implement this by transposing the state objects of all the notes only
 */
Guitar.prototype.transpose = function( num ){
    
    // get a matrix of copies of all the state objects
    var so = _(this.notes).map(function(string_notes){
        return _(string_notes).map(function(note){
            return _.clone(note.state);
        });
    });
    
    
    
    // assign the state objects to their new notes
    _(this.notes).each(function(string_notes, str_num){
        _(string_notes).each(function(note, fret_num){
            
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
};


/**
 * show function: shows chords, notes or scales on the fretboard
 * 
 * @str : the input string
 * 
 * @return : true if the query is valid and the fretboard has changed
 * 
 */
 
Guitar.prototype.show = function( str ){
    
    if( !str ) return;
    
    // clear fretboard
    this.clearFretboard();
    
    if( MUSIQ.isValidNote( str )){
        console.log("Showing single note");
       this.showNotes( [str] ); 
    } else if( MUSIQ.isValidNoteList( str ) ){
        console.log("Showing multiple notes");
        var noteList = Note.fromNotation( str );
        this.showNotes( noteList );
    } else if( MUSIQ.isValidChord( str )){
        console.log("Showing single chord");
        var chord = Chord.fromNotation( str );
        this.showChords( [chord]);
    } else if( MUSIQ.isValidScale( str )){
        console.log("Showing single scale");
        var scale = Scale.fromNotation( str );
        this.showScales( [chord]);
    } else {
        // cannot be parsed!
        console.warn("String cannot be shown: " + str);
        
        // function failed to show anything
        return false;
    }
    
    return true;
    
};

/**
 * show all the notes on the fretboard that match a
 * particular array of basic notes
 * 
 * @param notes : array with notes
 * @param options : object describing some formatting options:
 * 
 *      {   only: boolean,
 *          active: boolean,
 *          ghosted: boolean,
 *          tonic: boolean
 *      }
 * 
 */
Guitar.prototype.showNotes = function( notes, options ){
    
    // set the default options
    var opts = options || { only : true, active: true };
    
    console.log( notes );
    // convert it to an array of note objects
    
    // TODO: probably solve this with reduce
    var noteObjects = _(notes).map(function(n){
            if( n instanceof Note){
                return n;
            // check if N is a number
            } else if( _(n).isNumber() ){
                
                console.log("Note is number : " + n);
                
                // relative
                if( n < 12 ){
                    return new Note(n, true); // return a relative note
                } else {
                    // absolute
                    return new Note(n);
                }
            // check if N is a string
            } else if( _(n).isString() ){
                // convert it to a note
                console.log("Note is string : " + n);
                return Note.fromNotation(n);
            }
            // no match
            // return nothing
            console.log("Note not recognized! ");
            console.log(n);
            return;
        });
    
    //console.log( noteObjects );
    
    _(this.notes).each(function(string_notes){
        _(string_notes).each(function(note){
            
            // note is a GuitarNote object
            
            var noteFound = _(noteObjects).find(function(n){
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
};

/**
 * show all the notes of a list of chords on the fretboard
 */
Guitar.prototype.showChords = function( chords ){
    
    // get a list of notes - only from the first chord
    if( chords && chords.length > 0){
        this.showNotes( chords[0].notes );
        
        // set the tonic
        this.showTonic( chords[0].tonic );
    }
    
    
};

/**
 * show all notes of a particular scale on the fretboard
 */
Guitar.prototype.showScales = function( scales ){
    console.log("Function showScales not implemented!");
};

/**
 * show the tonic notes on the fret board as well
 * @param note : a Note object representing the current tonic
 */
Guitar.prototype.showTonic = function( note ){
    console.log("Showing tonic");
    console.log( note );
    
    this.showNotes( [note], { tonic: true });
};

/**
 * show the notes on the fretboard
 * @param frets : an array of integers representing which note to show
 *                on what string
 */
Guitar.prototype.showFrets = function( frets ){
   
   _(this.notes).each( function( string_notes, key ){
       if( frets[key] > -1 ){
           string_notes[frets[key]].active(true);
       };
   });
   
};

/**
 * clear all active or ghosted notes from the fretboard
 */
Guitar.prototype.clearFretboard = function(){
    
    _(this.notes).each(function(string_notes){
        _(string_notes).each(function(note){
            note.state = { active: false, ghosted: false, root: false };
        });
    });
    
};