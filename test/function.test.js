const {assert, expect, should} = require('chai');

describe('function', function () {
    describe('#bind', function () {
        it('prototype', function () {
            function A() {
            }

            function B() {
            }

            Object.setPrototypeOf(B, A);
            Object.setPrototypeOf(B.prototype, A.prototype);
            let f = function (x, y) {
                return x + y;
            };
            Object.setPrototypeOf(f, B);
            assert.equal(Object.getPrototypeOf(f), B);
            let f1 = f.bind('');
            assert.equal(Object.getPrototypeOf(f1), B);

            let fa = (x, y) => x + y;
            Object.setPrototypeOf(fa, B);
            assert.equal(Object.getPrototypeOf(fa), B);
            let fa1 = f.bind('');
            assert.equal(Object.getPrototypeOf(fa1), B);
        });
        it('this', function () {
            let getThis = function () {
                return this;
            };
            assert.equal(getThis(), this);
            let f = getThis.bind(1);
            assert.equal(f(), 1);
            let g = f.bind(2);
            // Keep first time bind this
            assert.equal(g(), 1);

            let getThis2 = () => this;
            assert.equal(getThis2(), this);
            let f2 = getThis2.bind(1);
            // Arrow Function already bind with this when it is to be declared.
            assert.equal(f(), this);
        });
    });
});