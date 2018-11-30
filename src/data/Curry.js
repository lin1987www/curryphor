import mix from '../mix';
import Monad from '../type/Monad';
import List from "./List";

const CurryInterface = mix('CurryInterface', [Monad]);

const CurryImplement = mix('CurryImplement', [CurryInterface, Function], Function);

class Curry extends CurryImplement {
    static map(bc, ab) {
        // Haskell (<$>) :: Functor f => (a -> b) -> f a -> f b
        // map :: (b -> c) -> (a -> b) -> a -> c
        // compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k
        return Curry.it(ab).map(bc);
    }

    static of(a) {
        let _a = _ => a;
        let f_a = Curry.it(_a);
        return f_a;
    }

    static it(fn, arity, prependArgs) {
        if (Curry.prototype.isPrototypeOf(fn)) {
            // Didn't need to create new Currying, because it will create instance every call.
            return fn;
        }
        return curry(fn, arity, prependArgs);
    }

    constructor(fn, arity, prependArgs) {
        super();
        let curryInstance = curry(fn, arity, prependArgs);
        return curryInstance;
    }

    map(bc) {
        // Fantasy Land
        // map :: Functor f => (a -⁠> b, f a) -⁠> f b
        // map :: Functor f => f a ~> (a -> b) -> f b
        // map :: (a -> b) -> (b -> c) -> a -> c
        //
        // Haskell (<&>) :: Functor f => f a -> (a -> b) -> f b
        bc = Curry.it(bc);
        let ab = this;
        let c = function (a) {
            let b = ab(a);
            let c = bc(b);
            return c;
        }
        let c1 = Curry.it(c);
        return c1;
    }

    fmap(fa) {
        // Haskell
        // (<$>) :: Functor f => (a -> b) -> f a -> f b
        // fmap  :: Functor f => (a -> b) -> f a -> f b
        //
        // compose - fmap (a -> b) ((->) r a)
        // (.) :: (b -> c) -> (a -> b) -> a -> c
        // (.) f g = \x -> f (g x)
        if (Function.prototype.isPrototypeOf(fa) && !Curry.prototype.isPrototypeOf(fa)) {
            fa = Curry.it(fa);
        } else if (Array.prototype.isPrototypeOf(fa) && !List.prototype.isPrototypeOf(fa)) {
            fa = List.from(fa);
        }
        return fa.map(this);
    }

    ap(aa0b) {
        // Fantasy Land
        // ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b
        // ap :: Apply f => f a ~> f (a -> b) -> f b
        // ap f g = \x -> g( x (f x))
        //
        // Haskell
        // (<**>) :: f a -> f (a -> b) -> f b
        // (<**>) :: (a -> a0) -> (a -> (a0 -> b)) -> a -> b
        // (<**>) f g = \x -> g( x (f x))
        aa0b = Curry.it(aa0b);
        let aa0 = this;
        let b = (a) => {
            return aa0b(a, aa0(a));
        };
        let b1 = Curry.it(b);
        return b1;
    }

    apH(fa) {
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        //
        // instance Applicative (->) r
        //     (<*>) :: (a -> (a0 -> b)) -> (a -> a0) -> a -> b
        //     (<*>) f g = \x -> f( x (g x))
        if (Function.prototype.isPrototypeOf(fa) && !Curry.prototype.isPrototypeOf(fa)) {
            fa = Curry.it(fa);
        } else if (Array.prototype.isPrototypeOf(fa) && !List.prototype.isPrototypeOf(fa)) {
            fa = List.from(fa);
        }
        return fa.ap(this);
    }

    chain(amb) {
        // (>>=) :: m a -> (a -> m b) -> m b
        // (>>=) :: (r -> a) -> (a -> (r -> b)) -> r -> b
        let ma = this;
        amb = Curry.it(amb);
        let rb = (r) => {
            let a = ma(r);
            let b = amb(a, r);
            return b;
        };
        let rb1 = Curry.it(rb);
        return rb1;
    }
}

function currying(bound, ...args) {
    let fn = bound.fn;
    let arity = bound.arity;
    if (args.length < arity) {
        // args is not enough
        let curryingNext = curry(fn, arity, args);
        return curryingNext;
    } else {
        let applyArgs = args.slice(0, arity);
        let theRestArgs = args.slice(arity);
        let result = fn.apply(null, applyArgs);
        if (theRestArgs.length == 0) {
            // args is just enough
            return result;
        } else {
            // args is more than enough
            return result(...theRestArgs);
        }
    }
};
Object.setPrototypeOf(currying, Curry.prototype);

function curry(fn, arity, prependArgs) {
    arity = arity || fn.length;
    prependArgs = prependArgs || [];
    let bound = {};
    let instance = currying.bind(null, bound, ...prependArgs);
    instance['bound'] = bound;
    bound.fn = fn;
    bound.arity = arity;
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

