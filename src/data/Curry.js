import mix from "../mix";
import Monad from "../type/Monad";

const CurryBase = mix('CurryBase', Monad, Function);

class Curry extends CurryBase {
    constructor(fn, arity) {
        if (Object.getPrototypeOf(fn) === Curry) {
            return fn;
        }
        arity = arity || fn.length;
        super();
        let self = {fn: fn, arity: arity};
        Object.setPrototypeOf(self, Curry.prototype);

        function curry(...args) {
            if (args.length < arity) {
                let f = curry.bind(null, ...args);
                self.args = args;
                return f;
            }
            return fn.call(null, ...args);
        };
        Object.setPrototypeOf(curry, self);
        let curryBind = curry.bind(self)();
        // bind with self
        self.map = this.map.bind(self);

        // return self instance to replace this
        return curryBind;
    }

    map() {
        return this.fn;
    }
}

export default Curry;