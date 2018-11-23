import mix from '../mix';
import Monad from '../type/Monad';

const CurryBase = mix('CurryBase', Monad, Function);

class Curry extends CurryBase {

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
                replaceCurryPrototypeOf(f, null, {args: args, curry: f});
                return f;
            }
            return fn.call(null, ...args);
        }

        let self = {fn: fn, arity: arity, args: prependArgs, curry: curry};

        // bind with self
        self.map = this.map.bind(self);

        // return curryBind instance to replace return this
        replaceCurryPrototypeOf(curry, self);
        let curryBind = curry.bind(null, ...prependArgs);
        return curryBind;
    }

    map(ab) {
        // map :: (b -> c) ~> (a -> b) -> a -> c
        let fab = new Curry(ab);
        let fbc = this.curry;
        let f = (a) => {
            return fbc(fab(a));
        };
        return f;
    }
}

export default Curry;