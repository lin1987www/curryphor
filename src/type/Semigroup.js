class Semigroup {
    static concat(a1, a2) {
        // mappend :: Semigroup => a -> a -> a
        return a1.concat(a2);
    }

    static mappend(a1, a2) {
        // mappend :: Semigroup => a -> a -> a
        return a1.concat(a2);
    }

    constructor() {
    }

    concat(a) {
        console.log('Semigroup.[[Prototype]].concat');
        // mappend :: Semigroup => a -> a -> a
    }

    mappend(a) {
        // mappend :: Semigroup => a -> a -> a
        return this.concat(a);
    }
}

export default Semigroup;
