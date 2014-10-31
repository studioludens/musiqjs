var defs = require('./defs');

var validators = {

    /**
     * isValidNote
     *
     * @param {string} notation - a string notation for a note
     *
     * @returns {boolean} true if the note can be parsed into a Note object
     */
    isValidNote: function( notation ){

        if( !notation ) return false;

        var regex = new RegExp("^" + defs.NOTE_REGEX + "?$","m");
        return regex.exec( notation );

    },

    /**
     *
     * @param {array} list
     * @returns {boolean} true if the list (in string format) is a valid list
     * we can use thesse delimiters:  " " (space), "," (comma) and "|" (pipe)
     * more probably to follow...
     *
     * @todo: implement this function
     *
     */
    isValidNoteList: function( list ){
        // split the list
        return false;
    },

    /**
     *
     * @todo: store these in a static variable when the function is first called
     *
     * @param {string} notation - string notation to check if valid
     *
     * @returns {array} matches from the regular expression if it's a valid chord
     *              0 : the whole matched name
     *              1 : the note
     *              2 : any specified accidentals
     *              3 : chord indicator / name
     */
    isValidChord: function( notation ){

        if( !notation) return false;

        // default to major
        var not = notation;
        if( !notation || notation.length == 0 ) not = "M";

        // TODO: make this shorter
        /*
         var chordNames =
         _.chain(MUSIQ.chords)
         .pluck("longname")
         .union(
         _(MUSIQ.chords).pluck("names") )
         .value()
         .join("|");
         */

        var chordNames = _(defs.chords).reduce(function(memo, item){
            var m = _(memo).isString() ? memo : memo.names.join("|") + "|" + memo.longName;
            //console.log(m);
            return m + "|" + item.names.join("|") + "|" + item.longName;
        });

        var regex = new RegExp("^" + defs.NOTE_SIMPLE_REGEX + " ?("+ chordNames + ")? ?" + defs.CHORD_REGEX + "$","m");
        //console.log( regex );
        return regex.exec( not );
    },

    /**
     * @param {array} list - list of strings with chord names
     * @returns {boolean} true if all chords are valid
     *
     * @todo - implement function
     */
    isValidChordList: function( list ){
        // check if the chord name is valid
        return false;
    },

    /**
     *
     * @param {string} notation -
     * @returns {boolean} true if it's a valid scale
     */
    isValidScale: function( notation ){

        if( !notation) return false;

        // default to major
        var not = notation;
        if( !notation || notation.length === 0 ) not = "M";

        // TODO: make this shorter

        var scaleNames = _(scales).reduce(function(memo, item){
            var m = _(memo).isString() ? memo : memo.names.join("|");
            //console.log(m);
            return m + "|" + item.names.join("|");
        });

        var regex = new RegExp("^" + defs.NOTE_SIMPLE_REGEX + " ?("+ scaleNames + ")? ?" + defs.SCALE_REGEX + "$","m");
        return regex.exec( not );
    },

    /**
     * @returns {boolean} true if
     *
     * @todo implement function
     */
    isValidScaleList: function( chord ){
        // check if the scale name is valid
        return false;
    }

};