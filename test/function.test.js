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
    describe('ES6', function () {
        it('object destructuring', function () {
            const fn = ({a = 0, b = 0}) => a + b;
            const args = {b: 2};
            assert.equal(fn(args), 2);
            assert.equal(fn({a: 1, b: 2}), 3);
        });
    });
    describe('Tail Call', function () {
        it('Error: Uncaught RangeError: Maximum call stack size exceede', function () {
            const repeat = n => f => x =>
                n === 0 ? x : repeat(n - 1)(f)(f(x));
            let result1000 = repeat(1e3)(x => x + 1)(0); // 1000
            assert.equal(result1000, 1000);
            // Error: Uncaught RangeError: Maximum call stack size exceede
            let error;
            try {
                expect(repeat(1e5)(x => x + 1)(0)).to.throw(new RangeError('Maximum call stack size exceeded'));
            } catch (e) {
                error = e;
            } finally {
                // assert.equal(error.message, 'Maximum call stack size exceeded');
                assert.equal(error != null, true);
            }
        });
    });
    describe('Tail Call Elimination', function () {
        it('Trampolines', function () {
            // trampoline
            const Bounce = (f, x) => ({isBounce: true, f, x});

            const Done = x => ({isBounce: false, x});

            const trampoline = ({isBounce, f, x}) => {
                // object destructuring
                while (isBounce) {
                    ({isBounce, f, x} = f(x));
                }
                return x;
            };

            // our revised repeat function, now stack-safe
            const repeat = n => f => x =>
                n === 0 ? Done(x) : Bounce(repeat(n - 1)(f), f(x));
            console.time('Trampolines');
            // apply trampoline to the result of an ordinary call repeat
            let result = trampoline(repeat(1e6)(x => x + 1)(0));
            // no more stack overflow
            assert.equal(result, 1000000);
            console.timeEnd('Trampolines');
        });
        it('Trampolines Curring', function () {
            // trampoline
            const Bounce = (f, x) => ({isBounce: true, f, x});

            const Done = x => ({isBounce: false, x});

            const trampoline = ({isBounce, f, x}) => {
                // object destructuring
                while (isBounce) {
                    ({isBounce, f, x} = f(x));
                }
                return x;
            };

            // aux helper hides trampoline implementation detail
            // runs about 2x as fast
            const repeat = n => f => x => {
                const aux = (n, x) =>
                    n === 0 ? Done(x) : Bounce(x => aux(n - 1, x), f(x));
                return trampoline(aux(n, x));
            };

            console.time('Trampolines Curring');
            // apply trampoline to the result of an ordinary call repeat
            let result = repeat(1e6)(x => x + 1)(0);
            // no more stack overflow
            assert.equal(result, 1000000);
            console.timeEnd('Trampolines Curring');
        });
        it('Clojure-style loop/recur', function () {
            const recur = (...args) =>
                ({type: recur, args});

            const loop = f => {
                let acc = f();
                while (acc && acc.type === recur) {
                    acc = f(...acc.args);
                }
                return acc;
            };

            const repeat = $n => $f => $x =>
                // Using default parameters to pass the initial value
                loop((n = $n, f = $f, x = $x) =>
                    n === 0
                        ? x
                        : recur(n - 1, f, f(x)));

            console.time('loop/recur');
            let result = repeat(1e6)(x => x + 1)(0);
            assert.equal(result, 1000000);
            console.timeEnd('loop/recur');
        });
        it('The continuation monad', function () {
            // f :: Cont r a
            // x :: (a -> r)
            // Bounce f x
            const Bounce = (f, x) =>
                ({isBounce: true, f, x});

            // trampoline :: Bounce f x => Bounce f x -> Bounce f x -> f(x)
            const trampoline = t => {
                while (t && t.isBounce) {
                    t = t.f(t.x);
                }
                return t;
            };
            // The Continuation monad represents computations in continuation-passing style (CPS).
            // http://www.haskellforall.com/2012/12/the-continuation-monad.html
            // http://hackage.haskell.org/package/mtl-2.2.2/docs/Control-Monad-Cont.html
            //
            // chain :: (Monad m) => m a -> (a -> m b) -> m b
            // instance Monad ((->) r)
            //     chain :: (Monad m) => (r -> a) -> (a -> (r -> b)) -> (r -> b)
            //     chain f k = (\ r ->  k ((f r) r) )
            // Continuation monad; stack-safe implementation
            // Cont :: (Monad Cont f) => f -> Cont f
            const Cont = f => ({
                _runCont: f,
                // f :: Cont r a
                // x :: a
                // g :: a -> Cont r b
                // k :: (b -> r)
                // chain :: Cont r a ~>  (a -> Cont r b) -> Cont r b
                chain: g =>
                    Cont(k =>
                        Bounce(f,
                            x =>
                                Bounce(g(x)._runCont, k)))
            });
            // x :: a
            // k :: (a -> r)
            // Cont.of :: x -> Cont k x
            Cont.of = x =>
                Cont(k =>
                    k(x));
            // m :: Cont k m
            // k :: (m -> r)
            // runCont :: m -> k -> r
            const runCont = (m, k) =>
                trampoline(Bounce(m._runCont, k));

            // repeat now leaks no implementation detail that a trampoline is used
            const repeat = n => f => x => {
                const aux = (n, x) =>
                    n === 0
                        // done
                        ? Cont.of(x)
                        // next
                        : Cont.of(f(x)).chain(x => aux(n - 1, x));
                return runCont(aux(n, x), x => x);
            };
            repeat(0)(x0 => x0 + 1)(0);
            console.time('The continuation monad');
            // looks like any other function, still stack-safe
            let result = repeat(1e6)(x => x + 1)(0);
            assert.equal(result, 1000000);
            console.timeEnd('The continuation monad');
        });
    });
});