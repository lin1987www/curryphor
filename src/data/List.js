import Foldable from "../type/Foldable";
import ListMonad from "./ListMonad";
import mix from "../mix";
import ListMonoid from "./ListMonoid";
import Monoid from "../type/Monoid";
import Monad from "../type/Monad";
import {options} from "./Curry";

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
        // create a new instance which we called subThis
        let subThis = new Array(...args);
        Object.setPrototypeOf(subThis, this);
        // bind with subThis
        // Monad
        let p = List.prototype;
        this.map = p.map.bind(subThis);
        this.ap = p.ap.bind(subThis);
        this.chain = p.chain.bind(subThis);
        // Semigroup
        this.concat = p.concat.bind(subThis);
        // Monoid
        this.empty = p.empty.bind(subThis);
        this.mconcat = p.mconcat.bind(subThis);
        // Foldable
        this.reduce = p.reduce.bind(subThis);
        this.reduceRight = p.reduceRight.bind(subThis);
        // return subThis instance to replace this
        return subThis;
    }

    map(ab) {
        // Functor f => f a ~>  (a -> b) -> f b
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