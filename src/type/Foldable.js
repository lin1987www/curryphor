class Foldable {
    static reduce(aba, a, fb) {
        // aba :: (a -> b -> a)
        // a   :: a
        // f b :: b
        // extracting b from f b
        // applying (a -> b -> a) function to a and b for getting a
        // a is result
        return fb.reduce(aba, a);
    }

    constructor() {
    }

    reduce(aba, a) {
        console.log('Foldable.[[Prototype]].reduce');
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
    }
}

export {Foldable};