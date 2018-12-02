import {List} from '../src/data/List';
import {id} from "../src/utility";
import {Curry} from "../src/data/Curry";

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
    describe('#reduce()', function () {
        it('should equal', function () {
            expect(list.reduce((a, x) => {
                a.push(x * 2);
                return a
            }, [])).to.deep.equal(List.of(2, 4, 6));
        });
    });
    describe('#reduceRight()', function () {
        it('should equal', function () {
            expect(list.reduceRight((a, x) => {
                a.push(x * 2);
                return a
            }, [])).to.deep.equal(List.of(6, 4, 2));
        });
    });
    describe('#traverse()', function () {
        it('should equal', function () {
            expect(List.of().traverse(x => x)).to.deep.equal([]);
            expect(List.of([]).traverse(x => x)).to.deep.equal([]);
            let list = List.of([1, 2, 3], [4, 5]);
            expect(list.traverse(x => x)).to.deep.equal([[1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]]);
        });
        it('should equal - 2', function () {
            // func(3)
            // > [0,1,2,3]
            // func(2)
            // > [0,1,2]
            let func = (x) => {
                return Array.from({length: x + 1}, (value, index) => index);
            };
            let list = func(3);
            list = List.from(list);
            expect(list.traverse(func)).to.deep.equal(
                [
                    [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 2], [0, 0, 0, 3], [0, 0, 1, 0], [0, 0, 1, 1],
                    [0, 0, 1, 2], [0, 0, 1, 3], [0, 0, 2, 0], [0, 0, 2, 1], [0, 0, 2, 2], [0, 0, 2, 3],
                    [0, 1, 0, 0], [0, 1, 0, 1], [0, 1, 0, 2], [0, 1, 0, 3], [0, 1, 1, 0], [0, 1, 1, 1],
                    [0, 1, 1, 2], [0, 1, 1, 3], [0, 1, 2, 0], [0, 1, 2, 1], [0, 1, 2, 2], [0, 1, 2, 3]
                ]
            );
        });
        it('should equal - 3', function () {
            // add :: a -> a -> a
            let add = (x, y) => {
                return x + y;
            };
            add = Curry.from(add);
            // add1 :: a -> a
            let add1 = add(1);
            let add2 = add(2);
            let add3 = add(3);
            // list :: [a -> a]
            list = List.of(add1, add2, add3);
            expect(list.traverse(id)(0)).to.deep.equal(
                [1, 2, 3]
            );
        });
    });
});
