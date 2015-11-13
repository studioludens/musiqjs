var expect   = require("chai").expect,
    Interval = require('../src/Interval'),
    Note     = require('../src/Note');

describe('Interval', function () {
    describe('Interval.fromNotes', function () {
        it('should create an Interval object from two notes', function () {
            var n1 = new Note(0), n2 = new Note(4);
            var i = Interval.fromNotes(n1, n2);
            expect(i).to.be.instanceof(Interval);
        });
    });
});