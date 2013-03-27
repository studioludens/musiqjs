// minify the library using the closure compiler
var compressor = require('node-minify');

// Using Google Closure
new compressor.minify({
    type: 'gcc',
    fileIn: ['src/MUSIQ.js',
                'src/Note.js',
                'src/Scale.js',
                'src/Chord.js',
                'src/Interval.js',
                'src/guitar/Guitar.js',
                'src/guitar/GuitarNote.js',
                'src/guitar/GuitarChord.js',
                'src/guitar/GuitarFret.js',
                'src/guitar/GuitarString.js'],
    fileOut: 'musiqjs.min.js',
    callback: function(err){
        console.log(err);
    }
});
