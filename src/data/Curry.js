import mix from '../mix';
import Monad from '../type/Monad';
import List from "./List";

const CurryInterface = mix('CurryInterface', Monad);

const CurryImplement = mix('CurryImplement', CurryInterface, Function);

class Curry extends CurryImplement {

    static it(fn, arity, hasOptArgs, prependArgs) {
        if (Curry.prototype.isPrototypeOf(fn)) {
            return fn;
        }
        return new Curry(fn, arity, hasOptArgs, prependArgs);
    }

    static of(a) {
        let _a = _ => a;
        let f_a = Curry.it(_a);
        return f_a;
    }

    static map(bc, ab) {
        // map :: (b -> c) -> (a -> b) -> a -> c
        // compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k
        bc = Curry.it(bc);
        ab = Curry.it(ab);
        let compose = function (a) {
            let b = ab(a);
            let c = bc(b);
            return c;
        }
        let c = Curry.it(compose);
        return c;
    }

    static ap(aa0b, aa0) {
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        // (<*>) :: (a -> (a0 -> b)) -> (a -> a0) -> a -> b
        // (<*>) f g x = f( x (g x))
        aa0b = Curry.it(aa0b);
        aa0 = Curry.it(aa0);
        let apFunctor = (a) => aa0b(a, aa0(a));
        return Curry.it(apFunctor);
    }

    constructor(fn, arity, hasOptArgs, prependArgs) {
        super();
        arity = arity || fn.length;
        hasOptArgs = hasOptArgs || true;
        prependArgs = prependArgs || [];

        let curryInstance = curry(fn, arity, hasOptArgs, prependArgs);
        return curryInstance;
    }

    map(bc) {
        // Fantasy Land
        // map :: Functor f => (a -⁠> b, f a) -⁠> f b
        // map :: Functor f => f a ~> (a -> b) -> f b
        // map :: (a -> b) -> (b -> c) -> a -> c
        return Curry.map(bc, this);
    }

    mapH(ab) {
        // Haskell
        // compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k
        // fmap :: (a -> b) -> f a -> f b
        // (.) :: (b -> c) -> (a -> b) -> a -> c
        // (.) f g = \x -> f (g x)
        if (Function.prototype.isPrototypeOf(ab)) {
            ab = Curry.it(ab);
        } else if (Array.prototype.isPrototypeOf(ab)) {
            ab = List.from(ab);
        }
        /*
        if (Curry.prototype.isPrototypeOf(ab)) {
            // Avoid call ab.map(this) error.
            return Curry.map(this, ab);
        }
        */
        return ab.map(this);
    }

    ap(f) {
        // Fantasy Land
        // ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b
        // ap :: Apply f => f a ~> f (a -> b) -> f b
        // ap g f = \x -> f( x (g x))
        //
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        // (<*>) :: (a -> (a0 -> b)) -> (a -> a0) -> a -> b
        // (<*>) f g = \x -> f( x (g x))
        return Curry.ap(f, this);
    }

    apH(g) {
        // Fantasy Land
        // ap :: Apply f => (f (a -⁠> b), f a) -⁠> f b
        // ap :: Apply f => f a ~> f (a -> b) -> f b
        // ap :: Apply f =>
        //
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        // (<*>) :: (a -> (a0 -> b)) -> (a -> a0) -> a -> b
        // (<*>) f g = \x -> f( x (g x))
        return Curry.ap(this, g);
    }
}

Curry.Bound = Symbol("Curry.Bound");

class AppendOptionalArgs extends Array {
    static options(...args) {
        return new AppendOptionalArgs(...args);
    }

    constructor(...args) {
        super(...args);
    }
}

function currying(boundArgs, ...args) {
    let fn = boundArgs.fn;
    let arity = boundArgs.arity;
    let hasOptArgs = boundArgs.hasOptArgs;
    if (args.length < arity) {
        // args is not enough
        let f = curry(fn, arity, hasOptArgs, args);
        return f;
    } else {
        for (let i = 0; i < arity; i++) {
            let arg = args[i];
            if (AppendOptionalArgs.prototype.isPrototypeOf(arg)) {
                throw new Error('Only allow to append options at last');
            }
        }
        let theRestStartIndex = arity;
        let applyArgs = args.slice(0, arity);
        if (AppendOptionalArgs.prototype.isPrototypeOf(args[arity])) {
            theRestStartIndex++;
            if (hasOptArgs) {
                applyArgs = applyArgs.concat(args[arity]);
            }
        }
        let theRest = args.slice(theRestStartIndex);
        let result = fn.apply(null, applyArgs);
        if (theRest.length == 0) {
            // args is just enough
            return result;
        } else {
            // args is more than enough
            return result(...theRest);
        }
    }
};
Object.setPrototypeOf(currying, Curry.prototype);

function curry(fn, arity, hasOptArgs, prependArgs) {
    let bound = {};
    let instance = currying.bind(null, bound, ...prependArgs);
    instance['bound'] = bound;
    bound.fn = fn;
    bound.arity = arity;
    bound.hasOptArgs = hasOptArgs;
    bound.prependArgs = prependArgs;
    //
    let p = Curry.prototype;
    instance.map = p.map.bind(instance);
    instance.mapH = p.mapH.bind(instance);
    instance.ap = p.ap.bind(instance);
    instance.apH = p.apH.bind(instance);
    //
    return instance;
}

let options = AppendOptionalArgs.options;
export {Curry, options};

