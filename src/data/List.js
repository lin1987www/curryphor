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
        // create a new instance which we called subThing
        let subThing = new Array(...args);
        Object.setPrototypeOf(subThing, this);
        // bind with subThing
        // Monad
        this.map = this.map.bind(subThing);
        this.ap = this.ap.bind(subThing);
        this.chain = this.chain.bind(subThing);
        // Semigroup
        this.concat = this.concat.bind(subThing);
        // Monoid
        this.empty = this.empty.bind(subThing);
        this.mconcat = this.mconcat.bind(subThing);
        // Foldable
        this.reduce = this.reduce.bind(subThing);
        this.reduceRight = this.reduceRight.bind(subThing);
        // return subThing instance to replace this
        return subThing;
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