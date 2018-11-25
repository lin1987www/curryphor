class Functor {
    static map(ab, fa) {
        // fmap
        // map :: (a -> b) -> f a -> f b
        return fa.map(ab);
    }

    constructor() {
    }

    map(ab) {
        console.log('Functor.[[Prototype]].map');
        // Functor f => f a ~>  (a -> b) -> f b
    }
}

export default Functor;
