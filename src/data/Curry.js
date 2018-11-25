import mix from '../mix';
import Monad from '../type/Monad';
import List from "./List";

const CurryInterface = mix('CurryInterface', Monad);

const CurryImplement = mix('CurryImplement', CurryInterface, Function);

class Curry extends CurryImplement {
    static it(fn, arity, prependArgs) {
        if (Curry.prototype.isPrototypeOf(fn)) {
            return fn;
        }
        return new Curry(fn, arity, prependArgs);
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

    constructor(fn, arity, prependArgs) {
        super();
        arity = arity || fn.length;
        prependArgs = prependArgs || [];

        let curryInstance = curry(fn, arity, prependArgs);
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

function curryingBind(fn, arity, prependArgs) {
    function currying(...args) {
        if (args.length < arity) {
            let f = curry(fn, arity, args);
            return f;
        } else if (args.length == arity) {
            let result = fn.call(null, ...args);
            return result;
        } else {
            let args1 = args.slice(0, arity);
            let args2 = args.slice(arity);
            let next = fn.call(null, ...args1);
            return next(...args2);
        }
    };

    /*
    let self = Object.create(Curry.prototype);
    Object.setPrototypeOf(currying, self);
    let instance = currying.bind(null, ...prependArgs);
    // bind
    let p = Curry.prototype;
    self.map = p.map.bind(instance);
    self.mapH = p.mapH.bind(instance);
    self.ap = p.ap.bind(instance);
    self.apH = p.apH.bind(instance);
    */

    Object.setPrototypeOf(currying, Curry.prototype);
    let instance = currying.bind(null, ...prependArgs);

    return instance;
}

function curry(fn, arity, prependArgs) {
    let curryingInstance = curryingBind(fn, arity, prependArgs);
    curryingInstance.currying = curryingInstance;
    curryingInstance.fn = fn;
    curryingInstance.arity = arity;
    curryingInstance.args = prependArgs;
    //
    let p = Curry.prototype;
    curryingInstance.map = p.map.bind(curryingInstance);
    curryingInstance.mapH = p.mapH.bind(curryingInstance);
    curryingInstance.ap = p.ap.bind(curryingInstance);
    curryingInstance.apH = p.apH.bind(curryingInstance);
    //
    return curryingInstance;
}

export default Curry;