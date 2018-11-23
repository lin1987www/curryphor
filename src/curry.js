// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
const curry = (fn, arity) => {
    if (typeof fn != "function") {
        // console.log('Only curry on function.');
        return fn;
    }
    /*
    if (Object.getPrototypeOf(fn) === Currying) {
        // console.log('Function is curried.');
        return fn;
    }
    */
    arity = arity || fn.length;

    // Arity is a term which specifies the amount of arguments that a function takes.
    function curried(...args) {
        if (args.length < arity) {
            return curried.bind(null, ...args);
        }
        console.log(this);
        return fn.call(null, ...args);
    };
    curried.arity = arity;
    curried.fn = fn;

    /*
    Object.setPrototypeOf(curried, Curry);
    */

    /*
    function curriedInstanceObject(...args) {
        curried(...args);
    }
    Object.setPrototypeOf(curriedInstanceObject, curried);
    */

    return curried;
};

function cclosure(fn, arity, param) {
    function ccurried(...args) {
        args = param.concat(args);
        if (args.length < arity) {
            return cclosure(fn, arity, args);
        }
        // 使用 this 的話 function 內部的運算會莫名其妙受到 this 的 data 所影響
        return fn.call(this, ...args);
    }
    return ccurried;
}

function ccurry(fn, arity) {
    arity = arity || fn.length;
    return cclosure(fn, arity, []);
}

export {curry as default, ccurry};