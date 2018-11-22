import Foldable from "../type/Foldable";
import Monoid from "../type/Monoid";
import ListMonad from "./ListMonad";
import mix from "../mix";

let ListBase = mix('List', Foldable, Monoid, ListMonad, Array);

class List extends ListBase {
    constructor(...args) {
        super();

        // create a new instance which we called self
        let self = new Array(...args);
        let prototype = Object.getPrototypeOf(this);
        Object.setPrototypeOf(self, prototype);

        // bind with self
        // Monad
        self.map = self.map.bind(self);
        self.ap = self.ap.bind(self);
        self.chain = self.chain.bind(self);
        // Semigroup
        self.concat = self.concat.bind(self);
        // Monoid
        self.empty = self.empty.bind(self);
        self.mconcat = self.mconcat.bind(self);
        // Foldable
        self.reduce = self.reduce.bind(self);

        // return self instance to replace this
        return self;
    }

    empty() {
        return this.of();
    }

    mconcat() {
        throw new Error('Need to implement.');
        //  mconcat :: Monoid a => [a] -> a
    }
}

export default List;