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

        /*
        let self = function (...args) {
            if (args.length < this.arity) {
                return self.bind(null, ...args);
            }
            return this.fn.call(null, ...args);
        };
        self.fn = fn;
        self.arity = arity;
        self = self.bind(self);
        */

        // 方法2
        // let self = curried.bind({fn: fn, arity: arity});

        // create a new instance which we called self
        let prototype = Object.getPrototypeOf(this);
        Object.setPrototypeOf(self, prototype);


        // return self instance to replace this
        return self;
    }

    getThis() {
        return this;
    }
}

/*
function curried(...args) {
    if (args.length < this.arity) {
        return curried.bind(this, ...args);
    }
    return this.fn.call(this, ...args);
}
Object.setPrototypeOf(curried, Curry);
*/



export default Curry;