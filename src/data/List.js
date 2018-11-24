import Foldable from "../type/Foldable";
import ListMonad from "./ListMonad";
import mix from "../mix";
import ListMonoid from "./ListMonoid";
import Monoid from "../type/Monoid";
import Monad from "../type/Monad";

const ListInterface = mix('ListInterface', Foldable, Monoid, Monad);

const ListImplement = mix('ListImplement', ListInterface, ListMonoid, ListMonad, Array);

class List extends ListImplement {

    static from(array) {
        if (array instanceof List || !(array instanceof Array)) {
            return array;
        }
        return new List(...array);
    }

    constructor(...args) {
        super();
        // create a new instance which we called self
        let self = new Array(...args);
        Object.setPrototypeOf(self, this);

        // bind with self
        // Monad
        this.map = this.map.bind(self);
        this.ap = this.ap.bind(self);
        this.chain = this.chain.bind(self);
        // Semigroup
        this.concat = this.concat.bind(self);
        // Monoid
        this.empty = this.empty.bind(self);
        this.mconcat = this.mconcat.bind(self);
        // Foldable
        this.reduce = this.reduce.bind(self);
        this.reduceRight = this.reduceRight.bind(self);
        // return self instance to replace this
        return self;
    }

    map(ab) {
        // Functor f => f a ~>  (a -> b) -> f b
        // 由於Array預設行為會丟入3個參數進去 ， 因此我們必須限制只能丟1個參數進去
        let ab1 = (currentValue, index, array) => ab(currentValue);
        return super.map(ab1);
    }

    reduce(aba, a) {
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
        let aba1 = (accumulator, currentValue, currentIndex, array) => aba(accumulator, currentValue);
        return super.reduce(aba1, a);
    }

    reduceRight(aba, a) {
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
        let aba1 = (accumulator, currentValue, currentIndex, array) => aba(accumulator, currentValue);
        return super.reduceRight(aba1, a);
    }

    empty() {
        return this.of();
    }
}

export default List;