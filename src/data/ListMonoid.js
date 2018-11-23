import Monoid from "../type/Monoid";

class ListMonoid extends Monoid {
    constructor() {
        super();
    }

    mconcat() {
        throw new Error('Need to implement.');
        //  mconcat :: Monoid a => [a] -> a
    }
}

export default ListMonoid;