import mix from '../mix';
import Monad from '../type/Monad';

const CurryInterface = mix('CurryInterface', Monad);

const CurryImplement = mix('CurryImplement', CurryInterface, Function);

class Curry extends CurryImplement {
    static for(fn, arity, prependArgs) {
        return new Curry(fn, arity, prependArgs);
    }

    static of(a) {
        let _a = _ => a;
        let f_a = Curry.for(_a);
        return f_a;
    }

    static map(fbc, fab) {
        fbc = Curry.for(fbc);
        fab = Curry.for(fab);
        let compose = (a) => fbc(fab(a));
        return Curry.for(compose);
    }

    constructor(fn, arity, prependArgs) {
        super();
        if (Curry.prototype.isPrototypeOf(fn)) {
            return fn;
        }
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
                replacePrototypeInstance(f, null, {currying: f, args: args});
                return f;
            } else if (args.length == arity) {
                return fn.call(null, ...args);
            } else {
                let args1 = args.slice(0, arity);
                let args2 = args.slice(arity);
                let next = fn.call(null, ...args1);
                return next(...args2);
            }
        };
        let self = createPrototypeInstance({currying: currying, args: prependArgs, fn: fn, arity: arity});
        // bind with self
        self.map = this.map.bind(self);
        // return curryBind instance to replace return this
        replacePrototypeInstance(currying, self);

        let curryBind = currying.bind(null, ...prependArgs);
        return curryBind;
    }

    map(ab) {
        // map :: (b -> c) ~> (a -> b) -> a -> c
        return Curry.map(this.currying, ab);
    }
}

export default Curry;