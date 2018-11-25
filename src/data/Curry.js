import mix from '../mix';
import Monad from '../type/Monad';
import List from "./List";

const CurryInterface = mix('CurryInterface', Monad);

const CurryImplement = mix('CurryImplement', CurryInterface, Function);

class Curry extends CurryImplement {
    static for(fn, arity, prependArgs) {
        if (Curry.prototype.isPrototypeOf(fn)) {
            return fn;
        }
        return new Curry(fn, arity, prependArgs);
    }

    static of(a) {
        let _a = _ => a;
        let f_a = Curry.for(_a);
        return f_a;
    }

    static map(bc, ab) {
        // map :: (b -> c) -> (a -> b) -> a -> c
        // compose :: Semigroupoid c => (c j k, c i j) -⁠> c i k
        bc = Curry.for(bc);
        ab = Curry.for(ab);
        let compose = function (a) {
            let b = ab(a);
            let c = bc(b);
            return c;
        }
        let c = Curry.for(compose);
        return c;
    }

    static ap(aa0b, aa0) {
        // Haskell
        // (<*>) :: f (a -> b) -> f a -> f b
        // (<*>) :: (a -> (a0 -> b)) -> (a -> a0) -> a -> b
        // (<*>) f g x = f( x (g x))
        aa0b = Curry.for(aa0b);
        aa0 = Curry.for(aa0);
        let apFunctor = (a) => aa0b(a, aa0(a));
        return Curry.for(apFunctor);
    }

    constructor(fn, arity, prependArgs) {
        super();
        arity = arity || fn.length;
        prependArgs = prependArgs || [];

        function createPrototypeInstance(...obj) {
            let prototypeInstance = Object.assign({}, ...obj);
            Object.setPrototypeOf(prototypeInstance, Curry.prototype);
            return prototypeInstance;
        }

        function replacePrototypeInstance(curryFunction, self, updateProperties) {
            self = self || Object.getPrototypeOf(curryFunction);
            updateProperties = updateProperties || {};
            let newSelf = createPrototypeInstance(self, updateProperties);
            Object.setPrototypeOf(curryFunction, newSelf);
        }

        function currying(...args) {
            if (args.length < arity) {
                let f = currying.bind(null, ...args);
                replacePrototypeInstance(f, null, {currying: f, args: args.slice()});
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
        let self = createPrototypeInstance({currying: currying, args: prependArgs.slice(), fn: fn, arity: arity});
        // bind with self
        self.map = this.map.bind(self);
        self.ap = this.ap.bind(self);
        // return curryBind instance to replace return this
        replacePrototypeInstance(currying, self);

        let curryBind = currying.bind(null, ...prependArgs);
        replacePrototypeInstance(curryBind, null, {currying: curryBind});
        return curryBind;
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
            ab = Curry.for(ab);
        } else if (Array.prototype.isPrototypeOf(ab)) {
            ab = List.from(ab);
        }

        if (Curry.prototype.isPrototypeOf(ab)) {
            // Avoid call ab.map(this) error.
            return Curry.map(this, ab);
        }

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

export default Curry;