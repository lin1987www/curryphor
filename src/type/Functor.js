class Functor {
    static map(ab, fa) {
        // fmap
        // map :: (a -> b) -> f a -> f b
        // extracting a from f a
        // applying (a -> b) function to a for getting b
        // wrapping b to f b
        return fa.map(ab);
    }

    constructor() {
    }

    map(ab) {
        console.log('Functor.[[Prototype]].map');
        // Functor f => f a ~>  (a -> b) -> f b
    }
}

export {Functor};
