import {transform} from '../utility';
import {mix} from '../mix';
import {Monad} from '../type/Monad';

const CurryBase = mix('CurryImplement', [Monad, Function], Function);

class Curry extends CurryBase {

    static of(a) {
        // const :: r -> a -> r
        // const x _ =  x
        let function_of_a = () => a;
        let of_a = Curry.from(function_of_a, 1);
        return of_a;
    }

    static from(fn, arity, applyThis, prependArgs) {
        if (Curry.prototype.isPrototypeOf(fn)) {
            // Didn't need to create new Currying, because it will create instance every call.
            return fn;
        }
        return curry(fn, arity, applyThis, prependArgs);
    }

    constructor(fn, arity, applyThis, prependArgs) {
        super();
        let curryInstance = curry(fn, arity, applyThis, prependArgs);
        return curryInstance;
    }

    map(ab) {
        // Fantasy Land
        // map :: Functor f => f a ~> (a -> b) -> f b
        // map :: (r -> a) -> (a -> b) -> (r -> b)
        //
        // Haskell
        // (<&>) :: Functor f => f a -> (a -> b) -> f b
        // (<&>) :: (r -> a) -> (a -> b) -> (r -> b)
        ab = Curry.from(ab);
        let ra = this;
        let compose = (r) => {
            let a = ra(r);
            let b = ab(a);
            return b;
        };
        let rb = Curry.from(compose);
        return rb;
    }

    fmap(fa) {
        // Fantasy Land
        // map :: Functor f => (a -⁠> b, f a) -⁠> f b
        //
        // Haskell
        // (<$>) :: Functor f => (a -> b) -> f a -> f b
        // fmap :: Functor f => (a -> b) -> f a -> f b
        // fmap :: (a -> b) -> ((->) r a) -> ((->) r b)
        //      :: (a -> b) -> (r -> a) -> (r -> b)
        // (.) :: (a -> b) -> (r -> a) -> (r -> b)
        // (.) f g = \x -> f (g x)
        fa = transform(fa);
        let ab = this;
        return fa.map(ab);
    }

    ap(rab) {
        // Fantasy Land
        // ap :: Apply f => f a ~> f (a -> b) -> f b
        // ap :: (r -> a) ~> (r -> (a -> b)) -> (r -> b)
        // f.ap(g) = \x -> g( x (f x))
        //
        // Haskell
        // (<**>) :: f a -> f (a -> b) -> f b
        // (<**>) :: (r -> a) -> (r -> (a -> b)) -> (r -> b)
        // (<**>) f g = \x -> g( x (f x))
        rab = Curry.from(rab);
        let ra = this;
        let function_ap_rb = (r) => {
            let b = rab(r, ra(r));
            return b;
        };
        let rb = Curry.from(function_ap_rb);
        return rb;
    }

    apH(fa) {
        // Fantasy Land
        // ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b
        // ap(f, g) = \x -> f( x (g x))
        //
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        // (<*>) :: (r -> (a -> b)) -> (r -> a) -> (r -> b)
        // (<*>) f g = \x -> f( x (g x))
        fa = transform(fa);
        let fab = this;
        return fa.ap(fab);
    }

    cchain(arb) {
        // (>>=) :: m a -> (a -> m b) -> m b
        // (>>=) :: (r -> a) -> (a -> (r -> b)) -> (r -> b)
        let ra = this;
        arb = Curry.from(arb);
        let function_chain_rb = (r) => {
            let a = ra(r);
            let b = arb(a, r);
            return b;
        };
        let rb = Curry.from(function_chain_rb);
        return rb;
    }
}

Curry.map = Curry.from(function map(ab, fa) {
    // Haskell (<$>) :: Functor f => (a -> b) -> f a -> f b
    // map :: (b -> c) -> (a -> b) -> a -> c
    // compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k
    return Curry.from(fa).map(ab);
});

function currying(bound, ...args) {
    let fn = bound.fn;
    let arity = bound.arity;
    let applyThis = bound.applyThis;
    if (args.length < arity) {
        // args is not enough
        let curryingNext = curry(fn, arity, applyThis, args);
        return curryingNext;
    } else {
        let applyArgs = args.slice(0, arity);
        let theRestArgs = args.slice(arity);
        let result = fn.apply(applyThis, applyArgs);
        if (theRestArgs.length == 0) {
            // args is just enough
            return result;
        } else {
            // args is more than enough
            return result(...theRestArgs);
        }
    }
}

Object.setPrototypeOf(currying, Curry.prototype);

function curry(fn, arity, applyThis, prependArgs) {
    arity = arity || fn.length;
    prependArgs = prependArgs || [];
    let bound = {};
    let instance = currying.bind(null, bound, ...prependArgs);
    instance['bound'] = bound;
    bound.fn = fn;
    bound.arity = arity;
    bound.applyThis = applyThis;
    bound.prependArgs = prependArgs;
    //
    let p = Curry.prototype;
    instance.map = p.map.bind(instance);
    instance.fmap = p.fmap.bind(instance);
    instance.ap = p.ap.bind(instance);
    instance.apH = p.apH.bind(instance);
    instance.chain = p.chain.bind(instance);
    //
    return instance;
}


export {Curry};
