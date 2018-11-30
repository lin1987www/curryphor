import mix from "../mix";
import {Curry} from "./Curry";
import Foldable from "../type/Foldable";
import Monoid from "../type/Monoid";
import Monad from "../type/Monad";
import Traversable from "../type/Traversable";

const ListInterface = mix('ListInterface', [Foldable, Monoid, Monad, Traversable]);

const ListImplement = mix('ListImplement', [ListInterface, Array], Array);

class List extends ListImplement {
    // Instance.method -> Prototype.method -> Constructor.method

    static empty() {
        return this.of();
    }

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

    ap(fab) {
        // 跟 Haskell 定義相反，但是結果一致! 由 fab fa 的巢狀結構
        // Apply f => f a ~> f (a -⁠> b) -⁠> f b
        return fab.reduce((fb, ab) => {
            return fb.concat(
                this.reduce((fb, a) => {
                    fb.push(ab(a));
                    return fb;
                }, List.of())
            );
        }, List.of());
    }

    cchain(amb) {
        // built-in flatMap only accept one function, but chain can accept a array of functions
        // Chain m => m a ~> (a -> m b) -> m b
        return this.reduce((mb, a) => {
            return mb.concat(amb(a));
        }, List.of());
    }

    fail(e) {
        return List.of();
    }

    concat(a) {
        // mappend :: Semigroup => a -> a -> a
        return super.concat(a);
    }

    mconcat() {
        // mconcat :: Monoid a => [a] -> a
        // mconcat :: [[a]] -> [a]
        return this.flat(1);
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

    traverse(afb) {
        // traverse :: (Applicative f, Traversable t) => t a ~> (a -> f b) -> f (t b)
        // instance Traversable [] where
        //     traverse f xs = foldr (\x v -> (:) <$> f x <*> v) (pure []) xs
        let result = this.reduceRight((v, x) => {
            // fb :: [a]
            let fb = afb(x);
            fb = List.from(fb);
            // concat2 :: [a] -> [a] -> [a]
            let concat2 = (a1, a2) => {
                return [a1].concat(a2);
            };
            concat2 = Curry.it(concat2);
            // fb_concat :: [[a] -> [a]]
            let fb_concat = fb.map(concat2);
            let result = v.ap(fb_concat);
            return result;
        }, List.of([]));
        return result;
    }
}

function createList(array, instance) {
    instance = instance || Object.create(List.prototype);
    Object.setPrototypeOf(array, instance);
    // bind with subThis

    let p = List.prototype;
    // Monad
    instance.map = p.map.bind(array);
    instance.ap = p.ap.bind(array);
    instance.chain = p.chain.bind(array);
    instance.cchain = p.cchain.bind(array);
    // Semigroup
    instance.concat = p.concat.bind(array);
    instance.mappend = p.mappend.bind(array);
    // Monoid
    instance.mconcat = p.mconcat.bind(array);
    // Foldable
    instance.reduce = p.reduce.bind(array);
    instance.reduceRight = p.reduceRight.bind(array);
    // Traversable
    instance.traverse = p.traverse.bind(array);
    // return subThis instance to replace this
    return array;
}

export default List;