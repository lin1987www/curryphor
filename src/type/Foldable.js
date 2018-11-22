class Foldable {
    static reduce(faba, a, fb) {
        return fb.reduce(faba, a);
    }

    constructor() {
    }

    reduce(faba, a) {
        console.log('Foldable.[[Prototype]].reduce');
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
    }
}

export default Foldable;