var _        = require('lodash'),
    expect   = require("chai").expect,
    MUSIQ    = require('../src/base'),
    Note     = require('../src/Note'),
    Interval = require('../src/Interval');

describe('Note', function () {

    describe('constructor', function () {
        it('should create a Note object', function () {
            var n = new Note(0);
            expect(n).to.be.instanceof(Note);
        });
        it('should create an absolute Note', function () {
            var n = new Note(12);
            expect(n.relative).to.not.be.true;
        });
        it('should create a relative Note', function () {
            var n = new Note(13, true);
            expect(n.relative).to.be.true;
            expect(n.pos).to.equal(1);
        });

        it('pos should never be higher than 11 when relative', function () {
            var n = new Note(32, true);
            expect(n.pos).to.be.lt(12);
            var n = new Note(12, true);
            expect(n.pos).to.be.lt(12);
        });
    });

    describe('Note.fromNotation', function () {
        it('should be a C0 note', function () {
            var n = Note.fromNotation('C');
            expect(n.pos).to.equal(0);
        });

        it('should be a C1 note', function () {
            var n = Note.fromNotation('C1');
            expect(n.pos).to.equal(12);
        });

        it('should be a C# note', function () {
            var n = Note.fromNotation('C#');
            expect(n.pos).to.equal(1);
        });

        it('should create a D note', function () {
            var n = Note.fromNotation('D');
            expect(n.pos).to.equal(2);
        });

        it('should support lowercase note names', function () {
            var n = Note.fromNotation('f');
            expect(n.pos).to.equal(5);
        });

        it('should support up to 3 accidentals for relative notes', function () {
            var expectations = [
                { not: 'C',    pos: 0,  acc: 0  },
                { not: 'C#',   pos: 1,  acc: 1  },
                { not: 'C##',  pos: 2,  acc: 2  },
                { not: 'C###', pos: 3,  acc: 3  },
                { not: 'Cb',   pos: 11, acc: -1 },
                { not: 'Cbb',  pos: 10, acc: -2 },
                { not: 'Cbbb', pos: 9,  acc: -3 },

                { not: 'E',    pos: 4,  acc: 0  },
                { not: 'E#',   pos: 5,  acc: 1  },
                { not: 'E##',  pos: 6,  acc: 2  },
                { not: 'E###', pos: 7,  acc: 3  },
                { not: 'Eb',   pos: 3,  acc: -1 },
                { not: 'Ebb',  pos: 2,  acc: -2 },
                { not: 'Ebbb', pos: 1,  acc: -3 },

                { not: 'B',    pos: 11,  acc: 0  },
                { not: 'B#',   pos: 0,   acc: 1  },
                { not: 'B##',  pos: 1,   acc: 2  },
                { not: 'B###', pos: 2,   acc: 3  },
                { not: 'Bb',   pos: 10,  acc: -1 },
                { not: 'Bbb',  pos: 9,   acc: -2 },
                { not: 'Bbbb', pos: 8,   acc: -3 },
            ];

            expectations.forEach(e => {
                var n = Note.fromNotation(e.not);
                expect(n.pos).to.equal(e.pos);
                expect(n.acc).to.equal(e.acc);
            });
        });

        it('should support up to 3 accidentals for absolute notes', function () {
            var expectations = [
                { not: 'C0',    pos: 0,  acc: 0  },
                { not: 'C#0',   pos: 1,  acc: 1  },
                { not: 'C##0',  pos: 2,  acc: 2  },
                { not: 'C###0', pos: 3,  acc: 3  },
                { not: 'Cb0',   pos: -1, acc: -1 },
                { not: 'Cbb0',  pos: -2, acc: -2 },
                { not: 'Cbbb0', pos: -3,  acc: -3 },

                { not: 'E0',    pos: 4,  acc: 0  },
                { not: 'E#0',   pos: 5,  acc: 1  },
                { not: 'E##0',  pos: 6,  acc: 2  },
                { not: 'E###0', pos: 7,  acc: 3  },
                { not: 'Eb0',   pos: 3, acc: -1 },
                { not: 'Ebb0',  pos: 2, acc: -2 },
                { not: 'Ebbb0', pos: 1,  acc: -3 },

                { not: 'B0',    pos: 11,  acc: 0  },
                { not: 'B#0',   pos: 12,  acc: 1  },
                { not: 'B##0',  pos: 13,  acc: 2  },
                { not: 'B###0', pos: 14,  acc: 3  },
                { not: 'Bb0',   pos: 10, acc: -1 },
                { not: 'Bbb0',  pos: 9, acc: -2 },
                { not: 'Bbbb0', pos: 8,  acc: -3 },
            ];

            expectations.forEach(e => {
                var n = Note.fromNotation(e.not);
                expect(n.pos).to.equal(e.pos);
                expect(n.acc).to.equal(e.acc);
            });
        });

        it('should return undefined when no valid notation', function () {
            var n = Note.fromNotation('Cf');
            expect(n).to.be.undefined;
        });
    });

    describe('Note.fromPos', function () {
        it('should return a Note when given an integer', function () {
            var n = Note.fromPos(5);
            expect(n).to.be.instanceof(Note);
        });

        it('should return undefined when given anything else', function () {
            var n = Note.fromPos('');
            expect(n).to.be.undefined;
            var n = Note.fromPos({});
            expect(n).to.be.undefined;
            var n = Note.fromPos([6]);
            expect(n).to.be.undefined;
        });
    });

    describe('Note.toJSON', function () {
        it('should properly convert to JSON and back', function () {
            var json = JSON.stringify(new Note(8, true, 2));
            var n = Note.fromJSON(json);
            expect(n.pos).to.equal(8);
            expect(n.relative).to.be.true;
            expect(n.acc).to.equal(2);
        });
    });

    describe('Note.distance', function () {
        it('should return an integer with the distance between two notes', function () {
            var n1 = new Note(10), n2 = new Note(15);
            expect(Note.distance(n1, n2)).to.equal(5);
        });

        it('should return a negative distance when the second note is lower than the first', function () {
            var n1 = new Note(30), n2 = new Note(20);
            expect(Note.distance(n1, n2)).to.equal(-10);
        });

        it('should return undefined when one of the elements is not a note', function () {
            var n1 = new Note(30), n2 = 'bla';
            expect(Note.distance(n1, n2)).to.be.undefined;
        });
    });

    describe('Note.relativeDistance', function () {
        it('should return an integer distance between two relative versions of notes', function () {
            var n1 = new Note(30), n2 = new Note(20);
            expect(Note.relativeDistance(n1, n2)).to.equal(2);
            expect(Note.relativeDistance(n2, n1)).to.equal(10);
        });
    });

    describe('Note.shortestDistance', function () {
        it('should return an integer with the shortest distance between two notes, always positive', function () {
            var n1 = new Note(30), n2 = new Note(20);
            expect(Note.shortestDistance(n1, n2)).to.equal(10);
            expect(Note.shortestDistance(n2, n1)).to.equal(10);
        });
    });

    describe('Note.shortestRelativeDistance', function () {
        it('should return an integer with the shortest relative distance between two notes, always positive', function () {
            var n1 = new Note(30), n2 = new Note(20);
            expect(Note.shortestRelativeDistance(n1, n2)).to.equal(2);
            expect(Note.shortestRelativeDistance(n2, n1)).to.equal(2);
        });
    });

    describe('Note.interval', function () {
        it('should return an Interval object describing the interval between two notes', function () {
            var n1 = new Note(0), n2 = new Note(4);
            expect(Note.interval(n1, n2)).to.be.instanceof(Interval);
            expect(Note.interval(n1, n2).distance).to.equal(4);
        });

        it('should return undefined if one of the two objects is not a note', function () {
            var n1 = new Note(0);
            //expect(Note.interval(n1, null)).to.be.undefined;
            //expect(Note.interval({}, n1)).to.be.undefined;
        });
    });

    describe('Note.signature', function () {
        // TODO: implement
    });

    describe('Note.transpose', function () {
        // TODO: implement
    });

    describe('Note.isValid', function () {
        // TODO: implement
    });

    describe('Note.notation', function () {
        it('should get the proper notation for all the basic notes', function () {
            var notes = _.range(12).map(num => new Note(num));
            //expect(1).to.equal(0);
            notes.forEach((note, i) => expect(Note.notation(note)).to.equal(MUSIQ.sharpNames[i] + '0'));
        });

        it('should take accidentals into account', function () {

            var expectations = [
                { not: 'C',    pos: 0,  acc: 0  },
                { not: 'C#',   pos: 1,  acc: 1  },
                { not: 'C##',  pos: 2,  acc: 2  },
                { not: 'C###', pos: 3,  acc: 3  },
                { not: 'Cb',   pos: 11, acc: -1 },
                { not: 'Cbb',  pos: 10, acc: -2 },
                { not: 'Cbbb', pos: 9,  acc: -3 },

                { not: 'E',    pos: 4,  acc: 0  },
                { not: 'E#',   pos: 5,  acc: 1  },
                { not: 'E##',  pos: 6,  acc: 2  },
                { not: 'E###', pos: 7,  acc: 3  },
                { not: 'Eb',   pos: 3,  acc: -1 },
                { not: 'Ebb',  pos: 2,  acc: -2 },
                { not: 'Ebbb', pos: 1,  acc: -3 },

                { not: 'B',    pos: 11, acc: 0  },
                { not: 'B#',   pos: 0,  acc: 1  },
                { not: 'B##',  pos: 1,  acc: 2  },
                { not: 'B###', pos: 2,  acc: 3  },
                { not: 'Bb',   pos: 10, acc: -1 },
                { not: 'Bbb',  pos: 9,  acc: -2 },
                { not: 'Bbbb', pos: 8,  acc: -3 },
            ];

            expectations.forEach(e => {
                var n = new Note(e.pos, true, e.acc);
                expect(n.notation()).to.equal(e.not);
            });
        });

        it('should throw an exception on invalid notes', function(){

            // it's all the same note, but with different accidentals
            var expectations = [
                { not: 'G###', pos : 10, acc :  3},
                { not: 'G###', pos : 10, acc :  2}, // invalid!!
                { not: 'A#',   pos : 10, acc :  1},
                { not: 'A#',   pos : 10, acc :  0}, // invalid!!
                { not: 'Bb',   pos : 10, acc : -1},
                { not: 'Cbb',  pos : 10, acc : -2},
                { not: 'Dbbbb',pos : 10, acc : -3}, // invalid!!
            ];

            expectations.forEach(e => {
                var n = new Note(e.pos, true, e.acc);
                expect(n.notation()).to.equal(e.not);
            });
        });
    });

    describe('Note.prototype.frequency', function(){
        it('should have A4 (concert pitch) at 440 Hz', function () {
            expect(Note.fromNotation('A4').frequency()).to.equal(440);
        });

        it('should have C0 at 8.1758 Hz', function () {
            //expect(Note.fromNotation('C0').frequency()).to.equal(8.1758);
        });
    });
});
