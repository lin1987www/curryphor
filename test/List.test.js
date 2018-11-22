import List from '../src/data/List';

const {assert, expect, should} = require('chai');  // Using Assert style

describe('List', function () {
    describe('#map()', function () {
        it('should equal', function () {
            expect(List.of(1, 2, 3).map(x => x * 2)).to.deep.equal(List.of(2, 4, 6));
        });
        it('should equal - bind', function () {
            let f = List.of(1, 2, 3).map;
            expect(f(x => x * 2)).to.deep.equal(List.of(2, 4, 6));
        });
    });
    describe('#ap()', function () {
        it('should equal', function () {
            expect(List.of(1, 2, 3).ap(List.of(x => x, x => x * x))).to.deep.equal(List.of(1, 2, 3, 1, 4, 9));
        });
        it('should equal - bind', function () {
            let f = List.of(1, 2, 3).ap;
            expect(f(List.of(x => x, x => x * x))).to.deep.equal(List.of(1, 2, 3, 1, 4, 9));
        });
    });
    describe('#of()', function () {
        it('should equal', function () {
            expect(List.of()).to.deep.equal(new List());
        });
        it('should equal - bind', function () {
            let f = List.of;
            expect(f()).to.deep.equal(new List());
        });
    });
    describe('#chain()', function () {
        it('should equal', function () {
            expect(List.of(1, 2, 3).chain(x => [x, x + 10])).to.deep.equal(List.of(1, 11, 2, 12, 3, 13));
        });
        it('should equal - bind', function () {
            let f = List.of(1, 2, 3).chain;
            expect(f(x => [x, x + 10])).to.deep.equal(List.of(1, 11, 2, 12, 3, 13));
        });
    });
    describe('#fail()', function () {
        it('should be empty', function () {
            expect(List.of(1, 2, 3).chain()).to.deep.equal(List.of());
        });
        it('should be empty - throw Error', function () {
            expect(List.of(1, 2, 3).chain(x => {
                throw new Error('Throw error');
                return x;
            })).to.deep.equal(List.of());
        });
    });
});
