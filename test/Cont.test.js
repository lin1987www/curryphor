import {Cont} from '../src/data/Cont';

const {assert, expect, should} = require('chai');

describe('Cont', function () {
    describe('is', function () {
        let c = Cont.of(1);
        it('Cont should be instance of Function', function () {
            assert.equal(c instanceof Function, true);
        });
    });
    describe('basic', function () {
        it('of', function () {
            // c1 :: (a -> r) -> r
            const c1 = Cont.of(1);
            // add20 :: (a -> a)
            const add20 = a => a + 20;
            // result :: r
            const result = c1(add20);
            assert.equal(result, 21);
        });
        it('from', function () {
            // f :: (a -> r)
            // c1 :: f -> r
            const c1 = Cont.from(f => f(1));
            // add20 :: (a -> a)
            const add20 = a => a + 20;
            // result :: r
            const result = c1(add20);
            assert.equal(result, 21);
        });
    });
    describe('#map()', function () {
        // Haskell (<&>) :: Functor f => f a -> (a -> b) -> f b
        it('map', function () {
            // c1 :: (a -> r) -> r
            const c1 = Cont.of(1);
            // add20 :: (a -> a)
            const add20 = a => a + 20;
            // result :: Cont r b
            const result = c1.map(add20);
            const id = x => x;
            assert.equal(result(id), 21);
        });
    });
});