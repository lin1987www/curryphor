import {Curry} from '../src/data/Curry';
import {List} from '../src/data/List';

const {assert, expect, should} = require('chai');

describe('Curry', function () {
    describe('is', function () {
        let f = Curry.from(() => 1);
        it('Currying should be instance of Function', function () {
            assert.equal(f instanceof Function, true);
        });
        it('Function prototype should be prototype of Curry', function () {
            assert.equal(Function.prototype.isPrototypeOf(f), true);
        });
        it('Currying should be instance of Curry', function () {
            assert.equal(f instanceof Curry, true);
        });
        it('Currying prototype sholud be prototype of Curry', function () {
            assert.equal(Curry.prototype.isPrototypeOf(f), true);
        });
        it('Currying should be type of function', function () {
            assert.equal(typeof f, 'function');
        });
    });
    describe('basic', function () {
        it('Curry currying function should return the same function.', function () {
            let f = Curry.from(cPlus3number);
            let f1 = Curry.from(f);
            assert.equal(f, f1);
        });
        let plus3number = (x, y, z) => x + y + z;
        let cPlus3number = Curry.from(plus3number);
        it('currying.apply()', function () {
            let f1 = cPlus3number.apply('plus 1', [1]);
            let f2 = f1.apply(null, [1]);
            assert.equal(f2.apply('plus 2', [2]), 4);
        });
        it('currying.call()', function () {
            let f4 = cPlus3number.call('3 plus 1', 3, 1);
            let f4a = f4.call(null);
            assert.equal(f4a.call('plus 2', 1), 5);
        });
        it('currying.bind()', function () {
            let f4 = cPlus3number.bind('3 plus 1', 3, 1);
            let f4a = f4.bind(null);
            let f6 = f4a.bind('plus 2', 2);
            assert.equal(f6(), 6);
        });
        it('(x -> y -> z -> a -> b -> c) -> x -> y -> z -> a -> b -> c', function () {
            let func = (x, y, z, a, b) => x + y + z + a + b;
            let f = Curry.from(func);
            let f1 = f.call(null, 1);
            let f12 = f1.apply(null, [2]);
            let f123 = f12.bind(null, 3);
            let f1234 = f123.call(null, 4);
            let result = f1234.apply(null, [5]);
            assert.equal(result, 15);
            //
            let f1234a = f1(2, 3, 4);
            let result2 = f1234a(5);
            assert.equal(result2, 15);
            //
            expect(f1234a.bound.prependArgs).to.deep.equal([1, 2, 3, 4]);
            assert.equal(f1234a.bound.arity, 5);
        });
    });
    describe('#map - Fantasy Land', function () {
        // Haskell (<&>) :: Functor f => f a -> (a -> b) -> f b
        it('List map currying function', function () {
            // f :: (b -> c)
            let ab = (x) => x + 100;
            let fa = List.from([1, 2, 3]);
            ab = Curry.from(ab);
            let result1 = fa.map(ab);
            expect(result1).to.deep.equal(List.of(101, 102, 103));
        });
        it('Currying function map function (compose)', function () {
            let g = (x, y, z) => {
                return x + y + z;
            };
            g = Curry.from(g);
            let f = (x) => {
                return x;
            };
            let gf = g.map(f);
            // result :: c
            let gf1 = gf(1);
            let gf2 = gf1(2);
            let result = gf2(3);
            assert.equal(result, 6);
        });
    });
    describe('#fmap', function () {
        // Haskell (<$>) :: Functor f => (a -> b) -> f a -> f b
        it('(b -> c) -> (a -> b) -> a -> c', function () {
            // f :: (b -> c)
            let bc = Curry.from((x) => x + 100);
            // g :: (a -> b)
            let ab = (x) => x + 20;
            // f 。 g  :: (b -> c) -> (a -> b)
            let bcab = bc.fmap(ab);
            let c = bcab(3);
            assert.equal(c, 123);
        });
        it('(b -> c) -> (a1 -> a2 -> b) -> a1 -> a2 -> c', function () {
            // f :: (b -> c)
            let bc = Curry.from((b) => {
                return b + 100;
            });
            // g :: (a1 -> a2 -> b)
            let a1a2b = Curry.from((x, y) => {
                return x + y + 20;
            });
            // :: (a2 -> b)
            let a2b = a1a2b(0);
            let bc_fmap = bc.fmap;
            // :: (b -> c) -> (a2 -> b)
            let bca2b = bc_fmap(a2b);
            // :: c
            let c = bca2b(3);
            assert.equal(c, 123);

            let a2b_ = a1a2b(4000);
            let bca2b_ = bc.fmap(a2b_);
            let c_ = bca2b_(3);
            assert.equal(c_, 4123);
        });
        it('(b -> c -> d) -> (a -> b) -> a -> c -> d', function () {
            // f :: (b -> c -> d)
            let f = Curry.from((b, c) => b + c);
            // g :: (a -> b)
            let g = (x) => x + 20;
            // fg :: ( b -> c -> d) -> (a -> b)
            let fg = f.fmap(g);
            // fg1 :: (c -> d)
            let fg1 = fg(3);
            // result1 :: d
            let result1 = fg1(100);
            assert.equal(result1, 123);

            // fg2 :: (c -> d)
            let fg2 = fg(4);
            // result2 :: d
            let result2 = fg2(100);
            assert.equal(result2, 124);
        });
        it('((b1 -> b2) -> c) -> (a -> (b1 -> b2)) -> a -> c', function () {
            // f :: ((b1 -> b2) -> c)
            let f = Curry.from(fb => fb(100));
            // g :: (a -> ( b1 -> b2 ))
            // g :: (a -> b1 -> b2) , is equivalent because currying.
            let g = (x, y) => x + y + 20;
            // fg :: ((b1 -> b2) -> c) -> (a -> ( b1 -> b2 ))
            let fg = f.fmap(g);
            // result :: c
            let result = fg(3);
            assert.equal(result, 123);
        });
        it('map(map, map) :: (b -> c) -> (a1 -> a2 -> b) -> a1 -> a2 -> c', function () {
            // map :: (b -> c) -> (a -> b) -> a -> c
            let map = Curry.map;
            // map2 :: (b -> c) -> (a1 -> a2 -> b) -> a1 -> a2 -> c
            let map2 = map(map, map);
            // f :: (b -> c)
            let f = x => x / 2;
            // g :: (a1 -> a2 -> b)
            let g = (x, y) => x / y;
            // result :: c
            let result = map2(f, g, 8, 2);
            assert.equal(result, 2);
        });
    });
    describe('#ap', function () {
        it('(<**>) :: f a -> f (a -> b) -> f b', function () {
            let f = (x, y) => x / y;
            let g = (x) => x + 90;
            g = Curry.from(g);
            let gxfx = g.ap(f);
            let x = 10;
            let result = gxfx(x);
            assert.equal(result, 10 / (10 + 90));
        });
    });
    describe('#apH', function () {
        it('(<*>) :: f (a -> b) -> f a -> f b', function () {
            let f = (x, y) => x / y;
            let g = (x) => x + 90;
            f = Curry.from(f);
            let fxgx = f.apH(g);
            let x = 10;
            let result = fxgx(x);
            assert.equal(result, 10 / (10 + 90));
        });
    });
    describe('#chain', function () {
        it('(>>=) :: (r -> a) -> (a -> (r -> b)) -> r -> b', function () {
            let f = (x, y) => x / y;
            let g = (x) => x + 90;
            g = Curry.from(g);
            let gxfx = g.chain(f);
            let x = 10;
            let result = gxfx(x);
            assert.equal(result, (10 + 90) / 10);
        });
    });
    describe('#chainRec', function () {
        /*
        it('test', function () {
            // TAG :: Symbol
            const TAG = Symbol('TAG');
            // tag :: t -> x -> x
            const tag = (tag_t, tag_x) =>
                Object.assign(tag_x, {[TAG]: tag_t});
            // is :: t -> x -> bool
            const is = (is_t, is_x) =>
                is_x && is_x[TAG] === is_t;
            // run :: x -> x ?
            const run = run_x =>
                tag(run, run_x);
            // call :: f -> x ?
            const call = (call_f, call_x) =>
                tag(call, {f: call_f, x: call_x});
            // trampoline :: t -> t
            const trampoline = trampoline_t => {
                let acc = trampoline_t;
                while (is(call, acc))
                    acc = acc.f(acc.x);
                return acc;
            };
            // continuation :: f -> g ?
            const cont = cont_f => cont_g =>
                is(run, cont_g)
                    ? trampoline(cont_f(cont_g))
                    : cont(
                    cont_cont_k => call(cont_f,
                        cont_cont_x =>
                            call(cont_g(cont_cont_x), cont_cont_k))
                    );
            // of ::
            const of = of_x =>
                cont(of_k =>
                    of_k(of_x));
            // chainRec ::  ChainRec m => f -> a -> m b
            // chainRec ::  ChainRec m => (((a -> c) -> (b -> c) -> a) -> m c) -> a -> m b
            const chainRec = chainRec_f => chainRec_x =>
                chainRec_f(
                    chainRec(chainRec_f),    // next :: (a -> c)
                    of,             // done :: (b -> c)
                    chainRec_x               // init :: a
                );
            // identity :: x -> x
            const identity = identity_x => identity_x;
            // inc :: x -> x
            const inc = inc_x => inc_x + 1;
            // repeat :: n -> f -> x ?
            const repeat = repeat_n => repeat_f => repeat_x =>
                chainRec(
                    (loop, done, [n, x]) =>
                        n === 0
                            ? of(x)(done)
                            : of([n - 1, repeat_f(x)])(loop)
                )(
                    [repeat_n, repeat_x]
                )(
                    run(identity)
                );

            console.log(repeat(1e3)(inc)(0));
            // 1000
            console.log(repeat(1e6)(inc)(0));
            // Error: Uncaught RangeError: Maximum call stack size exceeded
        });
        it('run', function () {
            // TAG :: Symbol
            const TAG = Symbol('TAG');
            // tag :: t -> x -> x
            const tag = (t, x) =>
                Object.assign(x, {[TAG]: t});
            const run = x =>
                tag(run, x);

            var run1 = run(x => x);
        });
        */
    });
});