import Curry from "../src/data/Curry";
import List from '../src/data/List';

const {assert, expect, should} = require('chai');

describe('Curry', function () {
    describe('#constructor()', function () {
        it('should instanceof', function () {
            let func = (x, y, z, a, b) => x + y + z + a + b;
            let f = Curry.for(func);
            assert.equal(f instanceof Curry, true);
            let f1 = f(1);
            assert.equal(f1 instanceof Curry, true);
            let f2 = f1(2);
            let f3 = f2(3);
            let f4 = f3(4);
            let result = f4(5);
            assert.equal(result, 15);
            let f5 = f1(10, 10, 10);
            expect(f5.args).to.deep.equal([1, 10, 10, 10]);
            let result2 = f5(10);
            assert.equal(result2, 41);
        });

    });
    describe('#curry', function () {
        it('#apply()', function () {
            let func = (x, y) => x + y;
            let f = Curry.for(func);
            let f1 = f.apply('', [1]);
            assert.equal(f1.apply('666', [2]), 3);
            assert.equal(f1.fn, func);
        });
        it('#call()', function () {
            let func = (x, y) => x + y;
            let f = Curry.for(func);
            let f1 = f.call(null, 1);
            assert.equal(f1.call('', 2), 3);
            assert.equal(f1.fn, func);
        });
        it('#bind()', function () {
            let func = (x, y) => x + y;
            let f = Curry.for(func);
            let f1 = f.bind('', 1)();
            assert.equal(f1.bind(null, 2)(), 3);
            assert.equal(f1.fn, func);
        });
        it('#curry()', function () {
            let func = (x, y) => x + y;
            let f = Curry.for(func);
            let f1 = Curry.for(f);
            assert.equal(f, f1);
        });
    });
    describe('#map', function () {
        it('(b -> c) -> (a -> b) -> a -> c', function () {
            let f = Curry.for((x) => x + 100);
            let g = (x) => x + 20;
            let fg = f.map(g);
            let result = fg(3);
            assert.equal(result, 123);
        });
        it('((b1 -> b2) -> c) -> (a -> (b1 -> b2)) -> a -> c', function () {
            // f :: ((b1 -> b2) -> c)
            let f = Curry.for(fb => fb(100));
            // g :: (a -> ( b1 -> b2 )) === g :: ((a -> b1) -> b2)
            let g = (x, y) => x + y + 20;
            let fg = f.map(g);
            let result = fg(3);
            assert.equal(result, 123);
        });
        it('(b -> c) -> ((a1 -> a2 -> b) -> a1) -> a2 -> c', function () {
            // f :: (b -> c)
            let f = Curry.for(b => b + 100);
            // g :: (a1 -> a2 -> b)
            let g = Curry.for((x, y) => x + y + 20);

            let g1 = g(0);
            let fg1 = f.map(g1);
            let result1 = fg1(3);
            assert.equal(result1, 123);

            let g2 = g(4000);
            let fg2 = f.map(g2);
            let result2 = fg2(3);
            assert.equal(result2, 4123);
        });
        it('(b -> c -> d) -> (a -> b) -> a -> c -> d', function () {
            // f :: (b -> c -> d)
            let f = Curry.for((b, c) => b + c);
            // g :: (a -> b)
            let g = (x) => x + 20;

            let fg = f.map(g);
            // fg1 :: (c -> d) -> c -> d
            let fg1 = fg(3);
            let result1 = fg1(100);
            assert.equal(result1, 123);

            // fg2 :: (c -> d) -> c -> d
            let fg2 = fg(4);
            let result2 = fg2(100);
            assert.equal(result2, 124);
        });
        it('Curry.map', function () {
            // f :: (b -> c)
            let f = (x) => x + 100;
            // g :: (a -> b)
            let g = (x) => x + 20;
            let c = Curry.map;
            let fg = c(f, g)
            let result1 = fg(3);
            assert.equal(result1, 123);

            let ccc = c(c, c);
            let f1 = x => x / 2;
            let g1 = (x, y) => x / y;
            let result2 = ccc(f1, g1, 8, 2);
            assert.equal(result2, 2);
        });
        it('List.map', function () {
            // f :: (b -> c)
            let ab = (x) => x + 100;
            let fa = [1, 2, 3];
            let result1 = Curry.for(ab).map(fa);
            expect(result1).to.deep.equal(List.of(101, 102, 103));
        });
    });
    describe('#ap', function () {
        it('Curry.ap', function () {
            let f = (x, y) => x / y;
            let g = (x) => x + 90;
            let fxgx = Curry.ap(f, g);
            let x = 10;
            let result = fxgx(x);
            assert.equal(result, 10 / (10 + 90));
            result = Curry.for(f).ap(g)(x);
            assert.equal(result, 10 / (10 + 90));
        });
    });
});