/**
 * GuitarFret - describes a guitar fret
 * 
 * @param guitar : the guitar this fret belongs to
 * @param pos : the position on the fretboard
 * 
 * the fret automatically calculates a number of useful variables
 * 
 */
 

var GuitarFret = function( guitar, pos ){
    
    this.guitar = guitar;
    this.pos    = pos;
    
    /**
     * if it's played barre
     */
    this.barre = false;
};

GuitarFret.prototype.notes = function(){
    return this.guitar.notesOnFret( this.pos );
};

/**
 * TODO: add this in another place, sort of a 
 * decorator type of function
 */
GuitarFret.prototype.class = function(){
    //console.log(this.pos);
    if( this.pos == 5) return "fifth";
    if( this.pos == 7) return "seventh";
    if( this.pos == 9) return "ninth";
    if( this.pos == 12 ) return "twelfth";
    
    return;
}

