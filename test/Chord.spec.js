var expect    = require("chai").expect,
    Chord     = require('../src/Chord'),
    MUSIQ     = require('../src/base');

describe('Chord', function(){

    describe('constructor', function () {

        it('should create a chord object', function(){
            var c = new Chord([0,4,7]);
            expect(c).to.be.an.instanceof(Chord);
        });

        it('should have basic properties', function(){
            var c = new Chord([0,4,7]);
            expect(c.notes.length).to.equal(3);
            expect(c.notes[0]).to.equal(0);
        });
    });

    describe('Chord.fromNotation', function () {

        it('should create all known C chords', function () {
            var chordNames = MUSIQ.chords.map(chord => chord.names[0]);

            chordNames.forEach(name => {
                expect(Chord.fromNotation('C' + name).notes).to.be.defined;
            });

            MUSIQ.chords.forEach(chord => {
                var c = Chord.fromNotation('C' + chord.names[0]);
                console.log('c', c);
                expect(c.notes[0]).to.equal(chord.notes[0])
            })
        });

        it('should create a C chord', function () {
            var c = Chord.fromNotation('C');
            expect(c.notes.length).to.equal(3);
        });

        it('should create a C# chord', function () {
            var c = Chord.fromNotation('C#');
            expect(c.notes.length).to.equal(3);
        });

    });



});
