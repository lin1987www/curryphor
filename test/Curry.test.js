import Curry from "../src/data/Curry";

const {assert, expect, should} = require('chai');

describe('Curry', function () {
    describe('#constructor()', function () {
        it('should instanceof', function () {
            let func = (x, y, z, a, b) => x + y + z + a +b;
            let f = new Curry(func);
            assert.equal(f instanceof Curry, true);
            let f1 = f(1);
            assert.equal(f1 instanceof Curry, true);
            let f2 = f1(2);
            let f3 = f2(3);
            let f4 = f3(4);
            let result = f4(5);
            assert.equal(result, 15);
            let f5 = f1(10,10,10);
            expect(f5.args).to.deep.equal([1,10,10,10]);
            let result2 = f5(10);
            assert.equal(result2, 41);
        });

    });
    describe('#curry', function () {
        it('#apply()', function () {
            let func = (x, y) => x + y;
            let f = new Curry(func);
            let f1 = f.apply('', [1]);
            assert.equal(f1.apply('666', [2]), 3);
            assert.equal(f1.fn, func);
        });
        it('#call()', function () {
            let func = (x, y) => x + y;
            let f = new Curry(func);
            let f1 = f.call(null, 1);
            assert.equal(f1.call('', 2), 3);
            assert.equal(f1.fn, func);
        });
        it('#bind()', function () {
            let func = (x, y) => x + y;
            let f = new Curry(func);
            let f1 = f.bind('', 1)();
            assert.equal(f1.bind(null, 2)(), 3);
            assert.equal(f1.fn, func);
        });
    });
});