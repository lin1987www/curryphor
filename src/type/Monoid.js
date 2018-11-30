import Semigroup from "./Semigroup";

class Monoid extends Semigroup {

    static empty() {
        console.log('Monoid.empty');
        // empty :: Monoid a => _ -> a
    }

    static get mempty() {
        // mempty :: Monoid a => a
        return this.empty();
    }

    constructor() {
        super();
    }

    mconcat() {
        console.log('Monoid.[[Prototype]].mconcat');
        // mconcat :: Monoid a => [a] -> a
        // Fantasy Land did not define
    }
}

export default Monoid;