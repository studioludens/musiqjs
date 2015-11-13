/**
 * MUSIQ: a javascript library for note and chord analysis
 *
 *
 * @namespace
 *
 * @property {array} noteNames - array of common note names
 * @property {array} notePositions - array of semitones for the notes in noteNames
 * @property {array} sharpNames - all notes represented with sharps
 * @property {array} flatNames - all notes represented with flats
 * @property {array} accidentals - accidentals that can be used for the notes
 * @property {array} cofPositions - position on the circle of fifths
 * @property {array} tonicPositions - preferred tonics for note lookup
 * @property {array} signatures - signatures (-1 means 1 flat, 1 means 1 sharp)
 * @property {array} solfege - solfege names
 * @property {array} intervalNames - names of the intervals
 * @property {array} chordExtensionNotes
 * @property {array} chords - a list of the most commonly occuring chords (in JSON format)
 * @property {array} scales
 *
 *
 *
 */
module.exports = {
    /**
     * the normal names of the notes
     */
    noteNames : ["C", "D", "E", "F", "G", "A", "B"],

    /**
     * positions of the normal notes
     */
    notePositions: [0, 2, 4, 5, 7, 9, 11],

    /**
     * the sharp names for all the notes
     *
     */
    sharpNames : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],


    /**
     * the flat names for all the notes
     */
    flatNames : ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],

    /**
     * accidentals that can be used for the notes
     */
    accidentals : ["bbb","bb","b","","#","##","###"],

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
    solfege : ["do", "di", "re", "me", "mi", "fa", "se", "sol", "le", "la", "te", "ti"],
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

    intervalQualities : [
        "perfect",
        "minor",
        "major",
        "diminished",
        "augmented"
    ],

    chordExtensionNotes : [1,2,8,9],
    /**
     * a list of the most commonly occuring chords
     * in JSON format
     */
    chords: [
        /* power chord */
        {
            'names': ["5", "power"],
            'longName': " power",
            'notes': [ 0, 7 ]
        },
        /* triads */
        {
            'names': ["maj", "M","ma", "major", ""],
            'longName': "major",
            'notes': [ 0, 4, 7 ]
        },
        {  'names': ["m","mi","min","minor","-"],
            'longName': "minor",
            'notes': [ 0, 3, 7 ]
        },
        {
            'names': ["dim","diminished","o"],
            'longName': "diminished",
            'notes': [ 0, 3, 6 ]
        },
        {
            'names': ["aug","augmented","a"],
            'longName': "augmented",
            'notes': [ 0, 4, 8 ]
        },
        /* suspended chords */
        {
            'names': ["sus2"],
            'longName': "suspended 2nd",
            'notes': [ 0, 2, 7 ]
        },
        {
            'names': ["sus4","su","sus"],
            'longName': "suspended 4th",
            'notes': [ 0, 5, 7 ]
        },

        /* jazz (7th) chords */
        {
            'names': ["maj7","maj 7", "major 7"],
            'longName': "major 7th",
            'notes': [ 0, 4, 7, 11 ],
            'optional': [7]
        },
        {
            'names': ["m7","mi7","min7","minor 7","-7"],
            'longName': "minor 7th",
            'notes': [ 0, 3, 7, 10 ],
            'optional': [7]
        },
        {
            'names': ["7","M7"],
            'longName': "dominant 7th",
            'notes': [ 0, 4, 7, 10 ],
            'optional': [7]
        },
        {
            'names': ["dim7","dim 7"],
            'longName': "diminished 7th",
            'notes': [ 0, 3, 6, 9 ]
        },
        {
            'names': ["m7b5","ø7","-7b5","m7(b5)"],
            'longName': "half diminished",
            'notes': [ 0, 3, 6, 10 ]

        },
        {
            'names': ["mM7"],
            'longName': "minor major seventh",
            'notes': [ 0, 3, 7, 11 ],
            'optional': [7]
        },
        /* sixths chords */
        {
            'names': ["6"],
            'longName': "major 6th",
            'notes': [ 0, 4, 7, 9 ],
            'optional': [7]
        },
        {
            'names': ["m6"],
            'longName': "minor 6th",
            'notes': [ 0, 3, 7, 9 ],
            'optional': [7]
        },
        /* ninth chords */
        {
            'names': ["9","M9"],
            'longName': "dominant 9th",
            'notes': [ 0, 4, 7, 10, 14 ],
            'optional': [7]
        },
        {
            'names': ["maj9"],
            'longName': "major 9th",
            'notes': [ 0, 4, 7, 11, 14 ],
            'optional': [7]
        },
        {
            'names': ["m9"],
            'longName': "minor 9th",
            'notes': [ 0, 3, 7, 10, 14 ],
            'optional': [7]
        },
        {
            'names': ["madd9","m add9","min add9"],
            'longName': "minor add 9th",
            'notes': [ 0, 3, 7, 14 ],
            'optional': [7]
        },
        {
            'names': ["add9","Madd9","maj add9"],
            'longName': "major add 9th",
            'notes': [ 0, 4, 7, 14 ],
            'optional': [7]

        },
        {
            'names': ["6/9","69"],
            'longName': "6 9th chord",
            'notes': [ 0, 4, 7, 9, 14 ],
            'optional': [7]
        },
        {
            'names': [" b9","Mb9","maj b9"],
            'longName': "major flat 9th",
            'notes': [ 0, 4, 7, 11, 13 ],
            'optional': [7]
        },
        {
            'names': ["7b9","M7b9","7 b9"],
            'longName': "dominant 7th flat 9th",
            'notes': [ 0, 4, 7, 10, 13 ],
            'optional': [7]
        },
        {
            'names': ["7#9","M7#9","7 #9","hendrix","7alt"],
            'longName': "dominant 7th sharp 9th",
            'notes': [ 0, 3, 4, 7, 10],
            'optional': [7]
        },
        {
            'names': ["#9","M#9","M #9","maj #9"],
            'longName': "sharp 9th",
            'notes': [ 0, 4, 7, 15 ],
            'optional': [7]
        },


        /* eleventh chords */
        {
            'names': ["maj11"],
            'longName': "major 11th",
            'notes': [ 0, 4, 7, 11, 17 ],
            'optional': [7]

        },
        {
            'names': ["m11"],
            'longName': "minor 11th",
            'notes': [ 0, 3, 7, 10, 17 ],
            'optional': [7, 10]
        },
        {
            'names': ["11"],
            'longName': "dominant 11th",
            'notes': [ 0, 4, 7, 10, 17 ],
            'optional': [7, 10]
        },

        /* thirteenth chords */
        {
            'names': ["maj13"],
            'longName': "major 13th",
            'notes': [ 0, 4, 7, 11, 21 ],
            'optional': [7]

        },
        {
            'names': ["m13"],
            'longName': "minor 13th",
            'notes': [ 0, 3, 7, 10, 21 ],
            'optional': [7]
        },
        {
            'names': ["13","M13"],
            'longName': "dominant 13th",
            'notes': [ 0, 4, 7, 10, 21 ],
            'optional': [7]
        },
        {
            'names': [" b13"],
            'longName': "flat 13th",
            'notes': [ 0, 4, 7, 10, 20 ],
            'optional': [7]
        }

    ],


    /* LOTS OF SCALES */
    scales: [
        {
            'names': ['chromatic','chro'],
            'longName': 'chromatic',
            'notes': [0,1,2,3,4,5,6,7,8,9,10,11]
        },
        {
            'names': ['major','ionian','-major', 'M'],
            'longName': 'major',
            'notes': [0,2,4,5,7,9,11]
        },
        {
            'names': ['minor','aeolian', 'm'],
            'longName': 'minor',
            'notes': [0,2,3,5,7,8,10]
        },


        /* pentatonic */

        {
            'names': ['major pentatonic','pentatonic'],
            'longName': 'major pentatonic',
            'notes': [0,2,4,7,9]
        },
        {
            'names': ['minor pentatonic','relative minor pentatonic'],
            'longName': 'relative minor pentatonic',
            'notes': [0,3,5,7,10]
        },



        /* blues (with blue notes added) */
        {
            'names': ['major blues','blues major','blues','hexatonic'],
            'longName': 'major blues',
            'notes': [0,2,4,6,7,9]
        },

        {
            'names': ['minor blues','blues minor','m blues'],
            'longName': 'minor blues',
            'notes': [0,3,5,6,7,10]
        },


        /* modes : TODO */
        {
            'names': ['ionian','Major'],
            'longName': 'ionian',
            'notes': [0,2,4,5,7,9,11]
        },
        {
            'names': ['dorian'],
            'longName': 'dorian',
            'notes': [0,2,3,5,7,9,10]
        },
        {
            'names': ['phrygian'],
            'longName': 'phrygian',
            'notes': [0,1,3,5,7,8,10]
        },
        {
            'names': ['lydian'],
            'longName': 'lydian',
            'notes': [0,2,4,6,7,9,11]
        },
        {
            'names': ['mixolydian'],
            'longName': 'mixolydian',
            'notes': [0,2,4,5,7,9,10]
        },
        {
            'names': ['aeolian', 'natural minor'],
            'longName': 'aeolian',
            'notes': [0,2,3,5,7,8,10]
        },
        {
            'names': ['locrian'],
            'longName': 'locrian',
            'notes': [0,1,3,5,6,8,10]
        }

        /* some simple scales */
    ],

    /** SOME REGULAR EXPRESSION MATCHES **/
    NOTE_REGEX : "([A-G]|[a-g])(bbb|bb|b|#|##|###)? ?([0-9])? ?(n|no|not|note|notes)",
    NOTE_SIMPLE_REGEX : "([A-G]|[a-g])(bbb|bb|b|#|##|###)?",
    SCALE_REGEX : "(s|sc|sca|scal|scale)?",
    CHORD_REGEX : "(c|ch|cho|chrd|chor|chord)?"
};
