/**
 * MUSIQ: a javascript library for note and chord analysis
 */

var MUSIQ = {
    /**
     * the normal names of the notes
     */
    noteNames : ["C", "D", "E", "F", "G", "A", "B"],
    notePositions: [0, 2, 4, 5, 7, 9, 11],

    /**
     * the sharp names for all the notes
     */
    sharpNames : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    /**
     * the flat names for all the notes
     */
    flatNames : ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    
    /**
     * accidentals that can be used for the notes
     */
    accidentals : ["bbb","bb","b","","#","x"],

    /**
     * position on the circle of fifths
     */
    cofPositions: [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5],
    
    /**
     * preferred tonics for note lookup
     */
    tonicPositions : [0, 5, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10],

    /**
     * signatures
     * -1 means 1 flat, 1 means 1 sharp
     */
    signatures : [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5],
    
    /**
     * solfege names
     */
    solfege : ["do", "di", "re", "me","mi", "fa", "se", "sol", "le", "la", "te", "ti"],
    /**
     * names of the intervals
     */
    intervalNames : [   "unison", 
                        "minor second", 
                        "major second", 
                        "minor third", 
                        "major third", 
                        "fourth", 
                        "tritone", 
                        "fifth", 
                        "minor sixth",
                        "major sixth",
                        "minor seventh",
                        "major seventh",
                        "octave"
                    ],
                    
    chordExtensionNotes : [1,2,5,8,9],
    /**
     * a list of the most commonly occuring chords
     * in JSON format
     */
    chords: {
        /* triads */
        'M': {  'names': ["","M", "maj", "ma", "major"],
                'longName': "major",
                'notes': [ 0, 4, 7 ]
             },
        'm': {  'names': ["m","mi","min","minor"],
                'longName': "minor",
                'notes': [ 0, 3, 7 ]
             },
        'dim': {  
                'names': ["dim","diminished","o"],
                'longName': "diminished",
                'notes': [ 0, 3, 6 ]
             },
        'aug': {  
                'names': ["aug","augmented","a"],
                'longName': "augmented",
                'notes': [ 0, 4, 8 ]
             },
        /* suspended chords */
        'sus2': {  
                'names': ["sus2"],
                'longName': "suspended 2nd",
                'notes': [ 0, 2, 7 ]
             },
        'sus4': {  
                'names': ["sus4"],
                'longName': "suspended 4th",
                'notes': [ 0, 5, 7 ]
             },      
             
        /* jazz (7th) chords */
        'maj7': {  
                'names': ["maj7"],
                'longName': "major 7th",
                'notes': [ 0, 4, 7, 11 ]
             },
        'm7': {  
                'names': ["m7"],
                'longName': "minor 7th",
                'notes': [ 0, 3, 7, 10 ]
             },
        'M7': {  
                'names': ["7","M7"],
                'longName': "dominant 7th",
                'notes': [ 0, 4, 7, 10 ]
             },
        'dim7': {  
                'names': ["dim7"],
                'longName': "diminished 7th",
                'notes': [ 0, 3, 6, 9 ]
             },
        'm7b5': {  
                'names': ["m7b5"],
                'longName': "half diminished",
                'notes': [ 0, 3, 6, 10 ]
                
             },
        'mM7': {  
                'names': ["mM7"],
                'longName': "minor major seventh",
                'notes': [ 0, 3, 7, 11 ],
                'optionalFifth': true
             },
        /* sixths chords */
        'maj6': {  
                'names': ["6"],
                'longName': "major 6th",
                'notes': [ 0, 4, 7, 9 ],
                'optionalFifth': true
             },
        'm6': {  
                'names': ["m6"],
                'longName': "minor 6th",
                'notes': [ 0, 3, 7, 9 ],
                'optionalFifth': true
             },
        /* ninth chords */
        'M9': {  
                'names': ["9"],
                'longName': "dominant 9th",
                'notes': [ 0, 4, 7, 10, 14 ],
                'optionalFifth': true
             },
        'maj9': {  
                'names': ["maj9"],
                'longName': "major 9th",
                'notes': [ 0, 4, 7, 11, 14 ],
                'optionalFifth': true
             },
        'm9': {  
                'names': ["m9"],
                'longName': "minor 9th",
                'notes': [ 0, 3, 7, 11, 14 ],
                'optionalFifth': true
             },
        'madd9': {  
                'names': ["madd9"],
                'longName': "minor add 9th",
                'notes': [ 0, 3, 7, 14 ],
                'optionalFifth': true
             },
        'Madd9': {  
                'names': ["add9"],
                'longName': "major add 9th",
                'notes': [ 0, 4, 7, 14 ],
                'optionalFifth': true
                
             },
        '6/9': {  
                'names': ["6/9"],
                'longName': "6 9th chord",
                'notes': [ 0, 4, 7, 9, 14 ],
                'optionalFifth': true
             },
        'M b9': {  
                'name': [" b9"],
                'longName': "flat 9th",
                'notes': [ 0, 4, 7, 10, 13 ],
                'optionalFifth': true
             },
        'M #9': {  
                'names': [" #9"],
                'longName': "sharp 9th",
                'notes': [ 0, 4, 7, 10, 15 ],
                'optionalFifth': true
             },
        
        
        /* eleventh chords */
        'maj11': {  
                'names': ["maj11"],
                'longName': "major 11th",
                'notes': [ 0, 4, 7, 11, 17 ],
                'optionalFifth': true
                
             },
        'm11': {  
                'names': ["m11"],
                'longName': "minor 11th",
                'notes': [ 0, 3, 7, 10, 17 ],
                'optionalFifth': true
             },
        'M11': {  
                'names': ["11"],
                'longName': "dominant 11th",
                'notes': [ 0, 4, 7, 10, 17 ],
                'optionalFifth': true
             },
        
        /* thirteenth chords */
        'maj13': {  
                'names': ["maj13"],
                'longName': "major 13th",
                'notes': [ 0, 4, 7, 11, 21 ],
                'optionalFifth': true
                
             },
        'm13': {  
                'names': ["m13"],
                'longName': "minor 13th",
                'notes': [ 0, 3, 7, 10, 21 ],
                'optionalFifth': true
             },
        'M13': {  
                'names': ["13"],
                'longName': "dominant 13th",
                'notes': [ 0, 4, 7, 10, 21 ],
                'optionalFifth': true
             },  
        ' b13': {  
                'names': [" b13"],
                'longName': "flat 13th",
                'notes': [ 0, 4, 7, 10, 20 ],
                'optionalFifth': true
             }   
        
    },
    
    
    /* LOTS OF SCALES */
    scales: {
        'chromatic' : {
            'names': ['Chromatic'],
            'notes': [0,1,2,3,4,5,6,7,8,9,10,11]
        },
        
        'major' : {
            'names': ['Major','Ionian'],
            'notes': [0,2,4,5,7,9,11]
        },
        'minor' : {
            'names': ['Minor','Aeolian'],
            'notes': [0,2,3,5,7,8,10]
        },
        
        
        
        /* pentatonic */
        'minor pentatonic' : {
            'names': ['Minor Pentatonic'],
            'notes': [0,2,3,7,9]
        },
        
        'major pentatonic' : {
            'names': ['Major Pentatonic'],
            'notes': [0,2,4,7,9]
        },
        
        
        /* modes : TODO */
        'ionian' : {
            'names': ['Ionian','Major'],
            'notes': [0,2,4,5,7,9,11]
        },
        'dorian' : {
            'names': ['Dorian'],
            'notes': [0,2,3,5,7,9,10]
        },
        'phrygian' : {
            'names': ['Phrygian'],
            'notes': [0,1,3,5,7,8,10]
        },
        'lydian' : {
            'names': ['Lydian'],
            'notes': [0,2,4,6,7,9,11]
        },
        'mixolydian' : {
            'names': ['Mixolydian'],
            'notes': [0,2,4,5,7,9,10]
        },
        'aeolian' : {
            'names': ['Aeolian', 'Natural Minor'],
            'notes': [0,2,3,5,7,8,10]
        },
        'locrian' : {
            'names': ['Locrian'],
            'notes': [0,1,3,5,6,8,10]
        }
        
        /* some simple scales */
    }
};

// MUSIQ utility functions

/**
 * isValidNote
 * @returns true if the note can be parsed into a Note object
 */
MUSIQ.isValidNote = function( notation ){
    
    // trim string and each substring
    
    var items = _(notation.trim().split(/(\d+)/)).map(function(item){return item.trim(); });
    console.log("isValidNote on " + notation);
    console.log(items);
    
    if( items.length > 3 ){
        // more than one note, return 
        return false;
    } else {
        
        // get note position 
        var nn = items[0][0].toUpperCase();
        var npos = MUSIQ.notePositions[ MUSIQ.noteNames.indexOf( nn ) ];
        
        // get accidental position
        var accString = items[0].substring(1);
        var acc = MUSIQ.accidentals.indexOf( accString ) - 3;
        
        // error case
        if( acc < -3 || typeof npos == 'undefined' || npos < 0 || parseInt(items[1]) > 5 ){
            return false;
        }
        
        // it's a valid note
        return true;
        
    }
};

/**
 * @returns true if the list (in string format) is a valid list
 * we can use thesse delimiters:  " " (space), "," (comma) and "|" (pipe)
 * more probably to follow...
 */
MUSIQ.isValidNoteList = function( list ){
   // split the list 
   return false;
};

/**
 * @returns true if
 */
MUSIQ.isValidChord = function( chord ){
    
    console.log("isValidChord on " + chord);
    
    // check if the chord name is valid
    if( Chord.fromNotation( chord.trim() ) ) return true;
    else return false;
};

/**
 * @returns true if
 */
MUSIQ.isValidChordList = function( chord ){
    // check if the chord name is valid
    return false;
};

/**
 * @returns true if
 */
MUSIQ.isValidScale = function( chord ){
    // check if the scale name is valid
    return false;
};

/**
 * @returns true if
 */
MUSIQ.isValidScaleList = function( chord ){
    // check if the scale name is valid
    return false;
};

