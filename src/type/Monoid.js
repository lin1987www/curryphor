import Semigroup from "./Semigroup";

class Monoid extends Semigroup {
    constructor() {
        super();
    }

    empty() {
        console.log('Monoid.[[Prototype]].empty');
        // empty :: Monoid a => _ -> a
    }

    get mempty() {
        // mempty :: Monoid a => a
        return this.empty();
    }

    mconcat() {
        console.log('Monoid.[[Prototype]].mconcat');
        //  mconcat :: Monoid a => [a] -> a
    }
}

export default Monoid;