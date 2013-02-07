/**
 * data structure for an interval
 */
var Interval = function( distance ){
    
    this.distance = distance;
    this.octaves = Math.floor(this.distance/12);
    this.relativeDistance = this.distance - this.octaves*12;
    
    //console.log(this.relativeDistance);
    
    this.name = function(){
        return MUSIQ.intervalNames[this.relativeDistance];
    }
    
    
    
};

Interval.fromNotes = function( note1, note2 ){
    return new Interval( note1.distance(note2) );
};
    
Interval.fromName = function( name ){
    return new Interval( MUSIQ.intervalNames.indexOf( name ) );
};