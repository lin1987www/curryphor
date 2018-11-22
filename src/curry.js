// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
const curry = (fn, arity) => {
    if (typeof fn != "function") {
        // console.log('Only curry on function.');
        return fn;
    }
    if (Object.getPrototypeOf(fn) === Currying) {
        // console.log('Function is curried.');
        return fn;
    }
    arity = arity || fn.length;

    // Arity is a term which specifies the amount of arguments that a function takes.
    function curried(...args) {
        if (args.length < arity) {
            return curried.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
    curried.arity = arity;
    curried.fn = fn;
    Object.setPrototypeOf(curried, Curry);

    /*
    function curriedInstanceObject(...args) {
        curried(...args);
    }
    Object.setPrototypeOf(curriedInstanceObject, curried);
    */

    return curried;
};

export {curry as default};