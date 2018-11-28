import Foldable from "../type/Foldable";
import ListMonad from "./ListMonad";
import mix from "../mix";
import ListMonoid from "./ListMonoid";
import Monoid from "../type/Monoid";
import Monad from "../type/Monad";
import {Curry} from "./Curry";

const ListInterface = mix('ListInterface', [Foldable, Monoid, Monad]);

const ListImplement = mix('ListImplement', [ListInterface, ListMonoid, ListMonad, Array], Array);

class List extends ListImplement {

    static of(...args) {
        return createList(Array.of(...args));
    }

    static from(obj) {
        return createList(Array.from(obj));
    }

    constructor(...args) {
        super();
        return createList(new Array(...args), this);
    }

    map(ab) {
        // Functor f => f a ~>  (a -> b) -> f b
        let ab1 = ab;
        if (Curry.prototype.isPrototypeOf(ab)) {
            ab1 = (currentValue, index, array) => {
                return ab(currentValue);
            };
        }
        return super.map(ab1);
    }

    reduce(aba, a) {
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
        let aba1 = aba;
        if (Curry.prototype.isPrototypeOf(aba)) {
            aba1 = (accumulator, currentValue, index, array) => {
                return aba(accumulator, currentValue);
            };
        }
        return super.reduce(aba1, a);
    }

    reduceRight(aba, a) {
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
        let aba1 = aba;
        if (Curry.prototype.isPrototypeOf(aba)) {
            aba1 = (accumulator, currentValue, index, array) => {
                return aba(accumulator, currentValue);
            };
        }
        return super.reduceRight(aba1, a);
    }

    empty() {
        return this.of();
    }
}

function createList(array, instance) {
    instance = instance || Object.create(List.prototype);
    Object.setPrototypeOf(array, instance);
    // bind with subThis
    // Monad
    let p = List.prototype;
    instance.map = p.map.bind(array);
    instance.ap = p.ap.bind(array);
    instance.chain = p.chain.bind(array);
    // Semigroup
    instance.concat = p.concat.bind(array);
    // Monoid
    instance.empty = p.empty.bind(array);
    instance.mconcat = p.mconcat.bind(array);
    // Foldable
    instance.reduce = p.reduce.bind(array);
    instance.reduceRight = p.reduceRight.bind(array);
    // return subThis instance to replace this
    return array;
}

export default List;