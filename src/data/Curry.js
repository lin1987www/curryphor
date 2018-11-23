import mix from "../mix";
import Monad from "../type/Monad";

const CurryBase = mix('CurryBase', Monad, Function);

class Curry extends CurryBase {
    constructor(fn, arity, prependArgs) {
        if (Object.getPrototypeOf(fn) === Curry) {
            // TODO  重做檢驗是否為 curried function
            return fn;
        }
        arity = arity || fn.length;
        prependArgs = prependArgs || [];
        super();

        function replaceCurryPrototypeOf(curryFunc, self, changedProperties) {
            self = self || Object.getPrototypeOf(curryFunc);
            changedProperties = changedProperties || {};
            let newSelf = Object.assign({}, self, changedProperties)
            Object.setPrototypeOf(curryFunc, newSelf);
            Object.setPrototypeOf(newSelf, Curry.prototype);
        }

        function curry(...args) {
            if (args.length < arity) {
                let f = curry.bind(null, ...args);
                replaceCurryPrototypeOf(f, null, {args: args});
                return f;
            }
            return fn.call(null, ...args);
        }

        let self = {fn: fn, arity: arity, args: prependArgs};

        // bind with self
        self.map = this.map.bind(self);

        // return curryBind instance to replace return this
        replaceCurryPrototypeOf(curry, self);
        let curryBind = curry.bind(null, ...prependArgs);
        return curryBind;
    }

    map() {
        return this.fn;
    }
}

export default Curry;