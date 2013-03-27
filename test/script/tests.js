// Test script


// EXECUTE test scripts

//test_Match();

// NOTES

test( "Note object", function(){
    
    var c = Note.fromNotation("C0");
    equal(c.relative,  false, "C.relative");
    
    var d = Note.fromNotation("D1");
    equal(d.relative,  false, "D.relative");
    
    var e = Note.fromNotation("E2");
    equal(e.relative,  false, "E.relative");
    
    var f = Note.fromNotation("F3");
    equal(f.relative,  false, "F.relative");
    
    f = Note.fromNotation("C 6 note");
    //console.log(f);
    equal(f.relative,  false, "C 6 note");
    
    // test sharp notes
    var fsharp = Note.fromNotation("F#6");

    /* SIMPLE (RELATIVE) NOTES */
    // test simple notes
    var simplec = Note.fromNotation("C");
    equal(simplec.relative,  true, "Simple C.relative");
    
    var simple_fsharp = Note.fromNotation("F#");
    equal(simple_fsharp.relative,  true, "Simple F#.relative");
    
    var cflat = Note.fromNotation("Cb3");
    equal(cflat.relative,  false);
    
    /* TEST CASE (SHOULD NOT HAVE TO MATTER) */
    equal(Note.fromNotation("c").pos,  0, "C pos");
    
    // this should result in warnings
    //console.log("Four notes that can't be found: ");
    equal(typeof Note.fromNotation("Bleg"),  'undefined', "Bleg = undefined");
    equal(typeof Note.fromNotation("Cf"),  'undefined',"Cf = undefined");
    equal(typeof Note.fromNotation("H"),  'undefined', "H = undefined");
    equal(typeof Note.fromNotation("C-"),  'undefined', "C- is undefined");
    
    // this should be fine:
    //console.log("No errors: ");
    
    //console.log("B");
    equal(Note.fromNotation("B").pos,  11, "B.pos = 11");
    
    //console.log("Gb");
    equal(Note.fromNotation("Gb").pos,  6, "Gb.pos = 6");
    
    //console.log("Dbbb (D triple flat)");
    equal(Note.fromNotation("Dbbb").pos,  11, "Dbbb.pos = 11");
    
    //console.log("Fx (double sharp)");
    equal(Note.fromNotation("F##").pos,  7, "F##.pos == 7");
    
    
    //console.log("Fx (double sharp, octave 2)");
    equal(Note.fromNotation("F##1").pos,  19, "F##1.pos = 19");
    

    // check note positions
    //console.log( Note.fromNotation("Cb1").pos);
    equal( Note.fromNotation("Cb1").pos,  11, "Cb1.pos = 11");
    
    //console.log( Note.fromNotation("B#"));
    equal( Note.fromNotation("B#").pos,  0, "B#.pos = 0");

    // log some distances
    equal(c.distance(d),  14, "C.distanceTo(D) = 14");
    equal(c.relativeDistance(d),  2, "C.relativeDistanceTo(D) = 2");

    // and the other way around
    equal(d.distance(c),  -14, "D.distanceTo(C) = -14");
    equal(d.relativeDistance(c),  10);

    // get the interval
    equal(d.interval(c).name(),  "minor seventh");

    // get the signature
    equal(d.signature(),  2, "D.signature = ##");

    // position on the circle of fifths
    equal(c.cofPosition(),  0, "C.cofPos = 0");

    // notation

    ok(fsharp.hasName("F#"));
    ok(fsharp.hasName("Gb"));

    // test relative positions of double flat edge cases. Say, C has position 0, but Cb should have 11
    // this should be 11
    equal( Note.fromNotation("Cb").relPos(), 11 );
    
    //console.log( "CFlat rel pos: " + cflat.relPos() + " | " + Note.fromNotation("Cb").relPos() );
    ok(cflat.hasName("Cb"));
    
    // test it for a higher note
    var cf1 = Note.fromNotation("Cb3");
    ok( cf1.hasName( "Cb" ) );

    // test hasName() function some more
    ok(Note.fromNotation("Fb").hasName("Fb"));
    ok(Note.fromNotation("Fb").hasName("E"));
    ok(Note.fromNotation("Fb").hasName("D##"));
    
    
    
    // test octave
    //console.log("Transposing C0 -> pos = " + c.transpose('octave').pos)
    equal(c.transpose('octave').pos,  12);
    
    equal(c.transpose(Interval.fromName('octave')).pos,  12);
    
    
    // test wrong values
    equal( Note.fromNotation(""), null);
    
    ok( Note.fromPos( -1 ).hasName("Cb") );
    
});
    // test notes with octave indication
    
// CHORDS

test( "Chord object", function(){

    var cmaj = Chord.fromNotation("C");
    
    //console.log( cmaj );
    // check if the tonic is relative
    ok( cmaj.tonic.pos == 0);
    ok( cmaj.tonic.relative == true);

    
    // chord from notation
    var dmaj7 = Chord.fromNotation("Dmaj7");
    
    ok( !dmaj7.hasName("Cmaj7") );
    //ok( !dmaj7.hasName("D") );
    
    

    // transpose it a bit
    dmaj7.tonic = Note.fromNotation("D5");
    
    //console.log( dmaj7.noteObjects());

    //var fmaj7 = Chord.fromNotes( [0,4,7] );

    // a C chord
    var chords1 = Chords.fromNotes( [0,4,7] );
    
    console.log( chords1 );
    
    //console.log( chords1[0].notation());
    ok( chords1[0].hasName("Cmaj" ) );
    
    ok( chords1[0].hasName("Cmaj") );
    ok( chords1[0].hasName("B#maj") );
    
    // check if not for a reason two chord names always match
    
    
    // a C# chord
    var chords2 = Chords.fromNotes( [1,5,8] );
    ok( chords2[0].hasName("C#maj"));
    
    var chords3 = Chords.fromNotes( [12,15,19,24] );
    //console.log( chords3 );
    
    
    
    var chords4 = Chords.fromNotes( [ 0, 4, 7, 11, 14 ] );
    var chords5 = Chords.fromNotes( [ 0, 4, 7, 11, 14 ] );
    
    
    //_.each(chords1, function(chord){ console.log(chord.notation()); });
    //_.each(chords2, function(chord){ console.log(chord.notation()); });
    //_.each(chords3, function(chord){ console.log(chord.notation()); });
    
    //_.each(chords4, function(chord){ console.log(chord.notation()); });
    //_.each(chords5, function(chord){ console.log(chord.notation()); });
    
});

test( "Guitar object", function(){

    /* GUITAR TESTS */
    var guitar = new Guitar();
    
    /* NOTES ON GUITAR */
    //console.log(guitar.notes[0][0].note.notation());
    ok(guitar.strings[1].base == 45);
    
    ok(guitar.notes[0][0].note.notation() == "E3","E3");
    ok(guitar.notationFor( 1, 3 ) == "C");
    
    /* NOTES ON SPECIFIC FRET */
    //console.log(guitar.notesOnFret(1));
    ok(guitar.notesOnFret(1)[0].notation() == "F3","F3");
    
    /* MAJOR CHORDS */

    // F
    //console.info("Looking for F ( 1 3 3 2 1 1 )");
    var Fmaj = guitar.chordsFromFingerPos([1, 3, 3, 2, 1, 1]);
    _.each(Fmaj, function(chord) {
        //console.log(chord.notation());
    });
    
    ok(Fmaj[0].hasName("Fmaj"),"Looking for F ( 1 3 3 2 1 1 )");

    // C
    console.info("Looking for C ( x 3 5 5 5 3 )");
    var Cmaj = guitar.chordsFromFingerPos([-1, 3, 5, 5, 5, 3]);
    _.each(Cmaj, function(chord) {
        console.log(chord.notation());
    });
    console.log( Cmaj[0].names ); 
    ok(Cmaj[0].hasName("C"),"Looking for C ( x 3 5 5 5 3 )");

    // another C
    //console.info("Looking for C ( x 3 2 0 1 0 )");
    var Cmaj = guitar.chordsFromFingerPos([-1, 3, 2, 0, 1, 0]);
    _.each(Cmaj, function(chord) {
        //console.log(chord.notation());
    });
    ok(Cmaj[0].hasName("C"),"Looking for C ( x 3 2 0 1 0 )");


    /* MINOR CHORDS */

    // let's plan an E minor on the guitar!
    //console.info("Looking for Em ( 0 2 2 0 0 x )");
    var emin = guitar.chordsFromFingerPos([0, 2, 2, 0, 0, -1]);
    _.each(emin, function(chord) {
        //console.log(chord.notation());
    });
    ok(emin[0].hasName("Em"));

    // an an e minor power chord
    //console.info("Looking for Em");
    var eminp = guitar.chordsFromFingerPos([0, 2, 2, - 1, - 1, - 1]);
    _.each(eminp, function(chord) {
        //console.log(chord.notation());
    });
    //ok( emin[0].notation() == "Em");

    /* DIMINISHED TRIADS */

    /* AUGMENTED TRIADS */

    /* SEVENTH (7th) CHORDS */

    // and a G minor 7!
    //console.warn("Looking for Gm7 (3, 5, 3, 3, 3, 3)");
    var gm7 = guitar.chordsFromFingerPos([3, 5, 3, 3, 3, 3]);
    _.each(gm7, function(chord) {
        //console.log(chord.notation());
    });
    ok(gm7[0].notation() == "Gm7","Looking for Gm7 (3, 5, 3, 3, 3, 3)");

    // A7
    //console.log("Looking for A7 (5, 7, 5, 6, 5, 5)");
    var A7 = guitar.chordsFromFingerPos([5, 7, 5, 6, 5, 5]);
    _.each(A7, function(chord) {
        //console.log(chord.notation());
    });
    ok(A7[0].notation() == "A7","Looking for A7 (5, 7, 5, 6, 5, 5)");

    // A7
    //console.log("Looking for A7 (x 0 2 0 2 0)");
    var A72 = guitar.chordsFromFingerPos([-1, 0, 2, 0, 2, 0]);
    _.each(A72, function(chord) {
        //console.log(chord.notation());
    });
    ok(A72[0].notation() == "A7","Looking for A7 (x 0 2 0 2 0)");

    // A7
    console.log("Looking for A7 (5 x 5 6 5 x)");
    var A73 = guitar.chordsFromFingerPos([5, - 1, 5, 6, 5, - 1]);
    _.each(A73, function(chord) {
        //console.log(chord.notation());
    });
    ok(A73[0].hasName("A7"),"Looking for A7 (5 x 5 6 5 x)" );

    // Bm7b5
    //console.log("Looking for Bm7b5 ( x 2 3 2 3 x )");
    var Bm7b5 = guitar.chordsFromFingerPos([-1, 2, 3, 2, 3, - 1]);
    _.each(Bm7b5, function(chord) {
        //console.log(chord.notation());
    });
    ok(Bm7b5[0].hasName("Bm7b5"),"Looking for Bm7b5 ( x 2 3 2 3 x )");

    // Bdim7
    console.log("Looking for Bdim ( x 2 3 1 3 x )");
    var Bdim = guitar.chordsFromFingerPos([-1, 2, 3, 1, 3, - 1]);
    _.each(Bdim, function(chord) {
        //console.log(chord.notation());
    });
    ok(Bdim[0].hasName( "Bdim7" ),"Looking for Bdim ( x 2 3 1 3 x )");

    // Gmaj7
    //console.log("Looking for Gmaj7 ( 3 x 4 4 3 )");
    var Gmaj7 = guitar.chordsFromFingerPos([3, - 1, 4, 4, 3, - 1]);
    _.each(Gmaj7, function(chord) {
        //console.log(chord.notation());
    });
    ok(Gmaj7[0].notation() == "Gmaj7","Looking for Gmaj7 ( 3 x 4 4 3 )");

    /* NINTH (9th) CHORDS */

    // C#9
    //console.log("Looking for C#9");
    var Cis9 = guitar.chordsFromFingerPos([-1, 4, 3, 4, 4, - 1]);
    _.each(Cis9, function(chord) {
        //console.log(chord.notation());
    });
    ok(Cis9[0].hasName("C#9"),"Looking for C#9");

    /* SIX CHORDS */

    // Am6
    //console.log("Looking for Am6");
    var Am6 = guitar.chordsFromFingerPos([5, - 1, 4, 5, 5, - 1]);
    _.each(Am6, function(chord) {
        //console.log(chord.notation());
    });
    ok(Am6[0].notation() == "Am6","Looking for Am6");

    // C6/9
    //console.log("Looking for C6/9");
    var C69 = guitar.chordsFromFingerPos([3, 3, 2, 2, 3, 3]);
    _.each(C69, function(chord) {
        //console.log(chord.notation());
    });
    ok(C69[0].notation() == "C6/9", "Looking for C6/9");

    /* ELEVENTH CHORDS */

    // Cm11
    //console.log("Looking for Cm11");
    var Cm11 = guitar.chordsFromFingerPos([8, -1, 8, 8, 6, -1]);
    _.each(Cm11, function(chord) {
        //console.log(chord.notation());
    });
    //ok(Cm11[0], "Looking for Cm11");
    
    //ok(Cm11[0].hasName("Cm11"),"Looking for Cm11");

    /* THIRTEENTH CHORDS */
    // G13
    //console.log("Looking for G13");
    var G13 = guitar.chordsFromFingerPos([3, - 1, 3, 4, 5, - 1]);
    _.each(G13, function(chord) {
        //console.log(chord.notation());
    });
    ok(G13[0].hasName("G13"),"Looking for G13");

    // G b13
    //console.log("Looking for G b13");
    var Gb13 = guitar.chordsFromFingerPos([3, - 1, 3, 4, 4, - 1]);
    _.each(Gb13, function(chord) {
        //console.log(chord.notation());
    });
    ok(Gb13[0].hasName("G b13"),"Looking for G b13");


});

test( "MUSIQ.match and similar", function(){
    
    var guitar = new Guitar();
    
    var c = Chord.fromNotation("c");
    //console.log(c);
    ok(c.relative, " C relative");
    
    var g = Note.fromNotation("G");
    //console.log(g);
    ok(g.relative, "G relative");
    
    ok(c.contains(g), "C contains G note");
    
    
    var vars = GuitarChord.fromChord(guitar, c);
    
    //console.log(vars);
    

    var matches = MUSIQ.match("c");
    //console.log(matches);
    
    // get the note match, it's a C, but it also
    // has the name B# (not that often used)
    ok( matches[0].hasName("B#"), "C matches B#" );
    
    ok( MUSIQ.isValidNote("c"), "C is valid note" );
    ok( MUSIQ.isValidChord("c"), "C is valid chord" );
    
});