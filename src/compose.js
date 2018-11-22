// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
// const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
function compose(...fns) {
    return (...args) => {
        // reduceRight :: Foldable f => f fns ~> callback -> initialValue -> accumulator
        // callback :: accumulator -> currentValue -> accumulator
        return fns.reduceRight((res, fn) => {
            return [fn.call(null, ...res)]
        }, args)[0];
    }
}

export {compose as default};