import List from '../src/data/List';

const {assert, expect, should} = require('chai');

describe('List', function () {
    let list = List.of(1, 2, 3);
    describe('#map()', function () {
        let multiplyBy2 = x => x * 2;
        it('should equal', function () {
            expect(list.map(multiplyBy2)).to.deep.equal([2, 4, 6]);
        });
        it('should equal - bound', function () {
            let listMap = list.map;
            expect(listMap(multiplyBy2)).to.deep.equal(List.of(2, 4, 6));
        });
    });
    describe('#ap()', function () {
        let id = x => x;
        let square = x => x * x;
        let fs = [id, square];
        it('should equal', function () {
            expect(list.ap(fs)).to.deep.equal([1, 2, 3, 1, 4, 9]);
        });
        it('should equal - bound', function () {
            let listAp = list.ap;
            expect(listAp(fs)).to.deep.equal(List.of(1, 2, 3, 1, 4, 9));
        });
    });
    describe('#of()', function () {
        it('should equal', function () {
            expect(List.of()).to.deep.equal(new List());
        });
        it('should equal - bound', function () {
            let f = List.of;
            expect(f()).to.deep.equal(new List());
        });
    });
    describe('#chain()', function () {
        let f = x => [x, x + 10];
        it('should equal', function () {
            expect(list.chain(f)).to.deep.equal(List.of(1, 11, 2, 12, 3, 13));
        });
        it('should equal - bound', function () {
            let listChain = list.chain;
            expect(listChain(f)).to.deep.equal([1, 11, 2, 12, 3, 13]);
        });
    });
    describe('#fail()', function () {
        it('should be empty, because fails in calling chain function with empty parameter.', function () {
            expect(list.chain()).to.deep.equal(List.of());
        });
        it('should be empty, because throw a error.', function () {
            expect(list.chain(x => {
                throw new Error('Throw a error');
                return x;
            })).to.deep.equal(List.of());
        });
    });
});
