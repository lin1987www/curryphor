const {assert, expect, should} = require('chai');

describe('function', function () {
    describe('#bind()', function () {
        it('this', function () {
            let getThis = function () {
                return this;
            };
            // this of f function should be 1
            let f = getThis.bind(1);
            assert.equal(f(), 1);
            // this of g function even bind different value, but can not change.
            let g = f.bind(2);
            // Keeping first time bind this, it should be 1
            assert.equal(g(), 1);
        });
        it('this - arrow function', function () {
            // this of arrow function already bound with lexical environment.
            let getThis2 = () => this;
            assert.equal(getThis2(), this);
            // Arrow Function already bound with this when it is to be declared.
            let f2 = getThis2.bind(1);
            assert.equal(f2(), this);
        });
        it('prototype', function () {
            function A() {
            }

            function B() {
            }
            // class B extends A
            Object.setPrototypeOf(B, A);
            Object.setPrototypeOf(B.prototype, A.prototype);
            // function f extends B
            let f = function (x, y) {
                return x + y;
            };
            Object.setPrototypeOf(f, B);
            assert.equal(Object.getPrototypeOf(f), B);
            // bind will create a new function, but property still the same
            let f1 = f.bind('');
            assert.equal(Object.getPrototypeOf(f1), B);
            assert.equal(f === f1, false);
            // arrow function fa extends B
            let fa = (x, y) => x + y;
            Object.setPrototypeOf(fa, B);
            assert.equal(Object.getPrototypeOf(fa), B);
            let fa1 = f.bind('');
            assert.equal(Object.getPrototypeOf(fa1), B);
        });
        it('bind', function () {
            class A extends Function {
                callByThis1(caller) {
                    assert.equal(this === caller, true);
                    caller.callByThis2(caller, this);
                }

                callByThis2(caller, self) {
                    assert.equal(this === caller, true);
                    assert.equal(this === self, true);
                }
            }
            // object fPrototypeOfA extends A
            let fPrototypeOfA = Object.create(A.prototype);
            fPrototypeOfA.tag = 'f.[[prototype]]';

            function f(x) {
                return x;
            }
            assert.equal(Function.prototype.isPrototypeOf(f), true);
            // change function f extends Object
            Object.setPrototypeOf(f, Object.prototype);
            assert.equal(Object.prototype.isPrototypeOf(f), true);
            assert.equal(Function.prototype.isPrototypeOf(f), false);
            // change function f extends fPrototypeOfA
            Object.setPrototypeOf(f, fPrototypeOfA);
            assert.equal(Function.prototype.isPrototypeOf(f), true);
            //
            assert.equal(f.tag === fPrototypeOfA.tag, true);
            let f1 = f.bind(null);
            assert.equal(f1.tag === fPrototypeOfA.tag, true);
            fPrototypeOfA.tag = 'f.[[prototype]] change 1';
            assert.equal(Object.getPrototypeOf(f1) === Object.getPrototypeOf(f), true);
            assert.equal(f1 === f, false);
            //
            f1.callByThis1(f1);
            //
            let fx = {};
            let f2 = f.bind(null, fx);
            assert.equal(f2() === fx, true);
            fx.tag = 'fx';
            assert.equal(f2().tag === 'fx', true);
        });
    });
});