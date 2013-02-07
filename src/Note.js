/**
 * the MUSIQ.js Note object
 * 
 * @param pos : the midi position of the note
 * @param relative : a boolean, true if the note is relative (it doesn't have
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
  * get a new note object from the notation
    @param : notation in the form C4, Bb6 etc
             where the number is the octave
             this should also match lowerCase notations
 */
Note.fromNotation = function( notation ){
     
    var ret;
    // split the notation
    
    var items = notation.split(/(\d+)/);
    
    if( items.length > 3 ){
        // more than one note, return 
        console.log("more than one note!");
        console.log(items);
        
    } else {
        // convert octave to integer, defaulting on 0 (if parsing fails)
        var octave = ( +items[1] || 0);
        // make relative or not
        var relative = octave < 1;
        
        console.log(" Note " + notation + " octave = " + octave + ", relative = " + relative);
        
        // just one note
        //console.log(items);
        
        // get note position 
        var nn = items[0][0].toUpperCase();
        var npos = MUSIQ.notePositions[ MUSIQ.noteNames.indexOf( nn ) ];
        
        // get accidental position
        var accString = items[0].substring(1);
        var acc = MUSIQ.accidentals.indexOf( accString ) - 3;
        
        // error case
        if( acc < -3 || typeof npos == 'undefined' || npos < 0 ){
            // sorry, nothing we can do
            console.log("ERROR: note not found (" + notation + ")");
            console.assert(false); // break
            return;
        }
        
        // build the note together with the octave
        ret = new Note( npos + acc + octave * 12, relative );
        
    }
    
    //console.log( ret );
    
    return ret;
        
};




/**
 * the distance (in semitones) to another note
 * this is the number notation of the interval
 */
Note.distance = function( note1, note2 ){
  return note2.pos - note1.pos;  
};

/**
 * returns the relative distance from note1 to note2
 */
Note.relativeDistance = function( note1, note2){
  var rel = note2.toRelative().pos - note1.toRelative().pos;
  return ( rel < 0 ) ? rel + 12 : rel;
};

/**
 * returns the shortest distance from note1 to note2
 */
Note.shortestDistance = function( note1, note2 ){
    return 0;
};

/**
 * returns the shortest relative distance
 */
Note.shortestRelativeDistance = function( note1, note2 ){
    return 0;
}; 


/**
 * the interval between the notes
 */
Note.interval = function( note1, note2 ){
    return new Interval( Note.distance(note1, note2) );
};

Note.signature = function( note ){
    return MUSIQ.signatures[note.toRelative().pos];
};

Note.cofPosition = function( note ){
    return MUSIQ.cofPositions[note.toRelative().pos];
};

/**
 * get the proper notation for a note
 */
Note.notation = function( note, flat ){
    // check flat
    if( flat ){
        return MUSIQ.flatNames[note.toRelative().pos] + note.octave();
    } else {
        return MUSIQ.sharpNames[note.toRelative().pos] + note.octave();
    }
};

/**
 * get a simple notation for a note, i.e. C#
 */
Note.simpleNotation = function( note, flat ){
   
   n = note;
   if( !(note instanceof Note) ) n = new Note(note);
   
   if( flat ){
        return MUSIQ.flatNames[n.toRelative().pos];
    } else {
        return MUSIQ.sharpNames[n.toRelative().pos];
    } 
};

/**
 * transpose a note with an interval
 */
Note.transpose = function( note, interval ){
    // check if it's an interval object
    if( _.isNumber( interval ) ){
        return new Note(note.pos + interval);
    } else if(_.isString( interval )) {
        return new Note(note.pos + Interval.fromName(interval).distance);
    } else {
        // let's hope it's an interval object
        return new Note(note.pos + interval.distance);
    }
};

/**
 * class methods
 */
Note.prototype.distance = function( note ){
    return Note.distance( this, note );
};

Note.prototype.relativeDistance = function( note ){
    return Note.relativeDistance( this, note);
};

Note.prototype.shortestDistance = function( note ){
    return Note.shortestDistance( this, note);
};

Note.prototype.interval = function( note ){
    return Note.interval( this, note);
};

Note.prototype.signature = function() {
    return Note.signature( this );
};

Note.prototype.cofPosition = function() {
    return Note.cofPosition( this );
};

Note.prototype.notation = function(flat) {
    return Note.notation(this, flat);
};

Note.prototype.simpleNotation = function(flat){
    return Note.simpleNotation(this, flat);
};

/**
 * the octave the note is in
 */
Note.prototype.octave = function( ){
    return Math.floor(this.pos/12) || 0;
};

/**
 * convert the note to a relative position
 */
Note.prototype.toRelative = function( ){
    return new Note(this.pos - this.octave()*12);
};

/**
 * transpose a note
 */
 Note.prototype.transpose = function( interval ){
     return Note.transpose( this, interval );
 };

/**
 * returns the frequency (in Hz) of the note
 * in equal temperament
 * 
 * use this for sound generation
 * 
 * possible optimization: lookup table
 */
Note.prototype.frequency = function(){
    return 440 * Math.pow(2, (this.pos-69)/12 );
};

