class Foldable {
    static reduce(aba, a, fb) {
        return fb.reduce(aba, a);
    }

    constructor() {
    }

    reduce(aba, a) {
        console.log('Foldable.[[Prototype]].reduce');
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
    }
}

export default Foldable;