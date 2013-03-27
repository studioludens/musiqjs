'use strict';
/** 
 * the guitar note data object
 * 
 * 
 * @constructor
 * 
 * @param {Guitar} guitar - a Guitar object this note belongs to
 * @param {GuitarString} guitarString - a GuitarString object this note belongs to
 * @param {GuitarFret} fret - the GuitarFret this note belongs to
 * @param {array} pos - the position as in [ string, fret ]
 * 
 * @param {object} state - an object representing the state of the note:
 *                         active: false,
 *                          ghosted: false,
 *                          tonic: false
 *                      
 */
var GuitarNote = function( guitar, guitarString, fret, pos, state ){

    this.guitar = guitar;
    this.guitarString = guitarString;
    this.fret = fret;
    this.pos = pos;
    
    //console.log( this.pos );
    
    this.state = state || _.clone( GuitarNote.DEFAULT_STATE );
    
    /*
     * create a Note object for easy access
     */
    this.note = new Note( guitarString.base + fret.pos );

    //console.log( this.note );
};

/**
 * the default state of the guitar note. 
 * when you use this, make sure to MAKE A COPY!
 */
GuitarNote.DEFAULT_STATE = { active: false, ghosted: false, tonic: false };

/**
 * get the notation
 * 
 * @returns {string} the notation
 */
GuitarNote.prototype.notation = function(){
    return this.note.notation();
};

/**
 * get the short notation
 * 
 * @param {integer} signature 
 * 
 * @returns {string} the Chord notation
 */
GuitarNote.prototype.short = 
GuitarNote.prototype.simple = function( signature ){
    return this.note.simpleNotation( signature );
};


/**
 * sets or gets the active state. 
 * 
 * @param {boolean} value 
 * @returns {boolean} true if the state is active
 */
GuitarNote.prototype.active = function( value ){
    if( typeof value != 'undefined'){
        this.state.active = value;
        return this.state.active;
    } else {
        return this.state.active;
    }
};

/**
 * sets or gets the tonic state. 
 * 
 * @param {Note} value - a Note object
 * @returns {boolean} true if the state is tonic
 */
GuitarNote.prototype.tonic = function( value ){
    if( typeof value != 'undefined'){
        this.state.tonic = value;
        return this.state.tonic;
    } else {
        return this.state.tonic;
    }
};

/**
 * sets or gets the active state. 
 * 
 * @param {boolean} value
 * @returns {boolean} true if the state is active
 */
GuitarNote.prototype.ghosted = function( value ){
    if( typeof value != 'undefined'){
        this.state.ghosted = value;
        return this.state.ghosted;
    } else {
        return this.state.ghosted;
    }
};

/**
 * 
 * @returns {integer} - number of the fret this note is on
 */
GuitarNote.prototype.fretPos = function(){
    return this.pos[1];
};

/**
 * 
 * @returns {integer} - number of the string this note is on
 *                      0 is the lowest string (in standard Guitar tuning
 *                      this would be the low E)
 */
GuitarNote.prototype.stringPos = function(){
    return this.pos[0];
};

/**
 * sets this note as the only active note on the string
 * 
 * @param {boolean} value - 
 * @returns {boolean} 
 */
GuitarNote.prototype.onlyActive = function( value ){
    return this.guitarString.onlyActive( this.pos[1], value );
};

/**
 * get a string representation of the class
 * 
 * @param {Note} [tonic] optionally specify a tonic. If so, the interval to the tonic is added as well
 * @returns {string} 
 */
GuitarNote.prototype.className = function( tonic ){
   var ret = [];
   if( this.state.active )  ret.push('active');
   if( this.state.ghosted ) ret.push('ghosted');
   if( this.state.tonic )   ret.push('tonic');
   
   // add the interval to the tonic as well
   if( tonic ) ret.push(this.intervalToTonic(tonic).name().replace(" ","-"));
   
   return ret.join(' ');
};

/**
 * the interval to the tonic
 * 
 * @param {Note} tonic - A Note object representing the tonic
 * 
 * @returns {Interval} an Interval object relative to the tonic
 */
GuitarNote.prototype.intervalToTonic = function( tonic ){
    if( tonic )
        return tonic.interval( this.note );
};

/**
 * get the int note position
 * 
 * @returns {integer} the MIDI position of the note
 */
GuitarNote.prototype.notePos = function(){
    return this.note.pos;
};

/**
 * get the relative note position
 * 
 * @returns {integer} the relative position of the note
 */
GuitarNote.prototype.relPos =
GuitarNote.prototype.relativeNotePos = function(){
    return this.note.toRelative().pos;
};

/**
 * get the 'distance' of a fret to another note on the fretboard
 * @returns {array} an array with 2 elements [ strings, frets ]
 * 
 */
GuitarNote.prototype.distanceTo = function( otherNote ){
    return [ otherNote.pos[0] - this.pos[0], otherNote.pos[1] - this.pos[1] ];
};