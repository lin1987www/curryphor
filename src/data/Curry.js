import mix from '../mix';
import Monad from '../type/Monad';

const CurryInterface = mix('CurryInterface', Monad);

const CurryImplement = mix('CurryImplement', CurryInterface, Function);

// TODO  Something her between Curry and CurryImplement
class CurryBase extends CurryImplement {
    constructor() {
        super();
    }
}

class Curry extends CurryBase {
    static of(a) {
        let _a = _ => a;
        let f_a = new Curry(_a);
        return f_a;
    }

    static map(fbc, fab) {
        fbc = new Curry(fbc);
        fab = new Curry(fab);
        return (a) => fbc(fab(a));
    }

    constructor(fn, arity, prependArgs) {
        super();
        if (Curry.prototype.isPrototypeOf(fn)) {
            return fn;
        }
        arity = arity || fn.length;
        prependArgs = prependArgs || [];

        function replaceCurryPrototypeOf(curryFunc, self, updateProperties) {
            self = self || Object.getPrototypeOf(curryFunc);
            updateProperties = updateProperties || {};
            let newSelf = Object.assign({}, self, updateProperties);
            Object.setPrototypeOf(curryFunc, newSelf);
            Object.setPrototypeOf(newSelf, Curry.prototype);
        }

        function curry(...args) {
            if (args.length < arity) {
                let f = curry.bind(null, ...args);
                replaceCurryPrototypeOf(f, null, {curry: f, args: args});
                return f;
            }
            return fn.call(null, ...args);
        }

        let self = {curry: curry, args: prependArgs, fn: fn, arity: arity};
        Object.setPrototypeOf(self, Curry.prototype);

        // bind with self
        self.map = this.map.bind(self);

        // return curryBind instance to replace return this
        replaceCurryPrototypeOf(curry, self);
        let curryBind = curry.bind(null, ...prependArgs);
        return curryBind;
    }

    map(ab) {
        // map :: (b -> c) ~> (a -> b) -> a -> c
        return this.constructor.map(this.curry, ab);
    }
}

export default Curry;