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
        hasOptArgs = hasOptArgs || fn.length > arity;
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

Curry.CurryingBoundArg = Symbol("Curry.currying.BoundArg");

class AppendOptionalArgs extends Array {
    static options(...args) {
        return new AppendOptionalArgs(...args);
    }

    constructor(...args) {
        super(...args);
    }
}

class CurryingArgs {
    static create(arity, hasOptArgs, originArgs) {
        return new CurryingArgs(arity, hasOptArgs, originArgs);
    }

    constructor(arity, hasOptArgs, originArgs) {
        this.arity = arity;
        this.hasOptArgs = hasOptArgs;
        this.originArgs = originArgs;
        this.options = [];
        this.theRest = [];
        this.args = [];

        for (let i = 0; i < originArgs.length; i++) {
            let arg = originArgs[i];
            if (i < arity) {
                // not allow options
                if (AppendOptionalArgs.prototype.isPrototypeOf(arg)) {
                    throw new Error('Options only append to last argument.');
                }
                this.args.push(arg);
            } else {
                if (AppendOptionalArgs.prototype.isPrototypeOf(arg)) {
                    // accept options
                    this.options = arg.slice();
                    this.theRest = originArgs.slice(i + 1);
                } else {
                    // the rest
                    this.theRest = originArgs.slice(i);
                }
                break;
            }
        }
    }

    isNotEnough() {
        return this.args.length < this.arity;
    }

    isJustEnough() {
        return this.args.length == this.arity && !this.isMoreThenEnough();
    }

    isMoreThenEnough() {
        return this.theRest.length > 0;
    }

    get argsWithOptions() {
        return this.args.concat(this.options);
    }
}

function currying(boundArgs, ...args) {
    let fn = boundArgs.fn;
    let arity = boundArgs.arity;
    let hasOptArgs = boundArgs.hasOptArgs;
    let curryingArgs = CurryingArgs.create(arity, hasOptArgs, args);
    if (curryingArgs.isNotEnough()) {
        // args is not enough
        let f = curry(fn, arity, hasOptArgs, curryingArgs.args);
        return f;
    } else if (curryingArgs.isJustEnough()) {
        // args is enough
        let result = fn.apply(null, curryingArgs.argsWithOptions);
        return result;
    } else {
        // args is enough, and has the rest
        let next = fn.apply(null, curryingArgs.argsWithOptions);
        return next(...curryingArgs.theRest);
    }
};
Object.setPrototypeOf(currying, Curry.prototype);

function curry(fn, arity, hasOptArgs, prependArgs) {
    let boundArgs = {};
    let instance = currying.bind(null, boundArgs, ...prependArgs);
    instance[Curry.CurryingBoundArg] = boundArgs;
    boundArgs.fn = fn;
    boundArgs.arity = arity;
    boundArgs.hasOptArgs = hasOptArgs;
    boundArgs.prependArgs = prependArgs;
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
export {Curry, AppendOptionalArgs, options};

