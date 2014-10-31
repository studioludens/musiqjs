var musiq = require('./musiq');
/**
 * guitar stuff
 */
musiq.guitar = {};

/**
 * @returns {array} a list of matches if it's a valid finger position of the notes
 * currently played on a guitar neck
 *
 * example: "0 2 2 1 0 x" - should get an E-chord
 *
 */
musiq.guitar.isValidFingerPos = function( tab ){
    var regex = new RegExp("^((xX|[0-9]{1,2})[ -]*){6}$","m");
    return regex.exec( tab );
};

/**
 * @param {GuitarChord} chord - a GuitarChord object
 *
 * @todo implement function
 */
musiq.guitar.isValidChord = function( chord ){

};

module.exports = musiq;