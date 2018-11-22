class Functor {
    static map(fab, fa) {
        // fmap
        // map :: (a -> b) -> f a -> f b
        return fa.map(fab);
    }

    constructor() {
        console.log('Functor');
    }

    map(fab) {
        console.log('Functor.[[Prototype]].map');
        // Functor f => f a ~>  (a -> b) -> f b
    }
}

export default Functor;