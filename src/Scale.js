// Representation of a musical scale
var Scale = function( type ){
   this.type = type;
   
};

/**
 * create a scale from a tonic note and a type
 */
Scale.fromTonicAndType = function( tonic, type ){
    
};

/**
 * extend a scale over a number of octaves
 */
Scale.extend = function( startOctave, endOctave ){
    this.startOctave = startOctave;
    this.endOctave = endOctave;
}