import {mix} from '../mix';
import {Curry} from './Curry';
import {Foldable} from '../type/Foldable';
import {Monoid} from '../type/Monoid';
import {Monad} from '../type/Monad';
import {Traversable} from '../type/Traversable';
import {transform} from '../utility';

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

    static from(...args) {
        return createList(Array.from(...args));
    }

    constructor(...args) {
        super();
        return createList(new Array(...args), this);
    }

    map(ab) {
        // Functor f => f a ~>  (a -> b) -> f b
        let ab1 = ab;
        if (Curry.prototype.isPrototypeOf(ab)) {
            // for ignore index and array optional parameters
            ab1 = (currentValue) => {
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

    fail() {
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
            // for ignore index and array optional parameters
            aba1 = (accumulator, currentValue) => {
                return aba(accumulator, currentValue);
            };
        }
        return super.reduce(aba1, a);
    }

    reduceRight(aba, a) {
        // Foldable f => f b ~> (a -> b -> a) -> a -> a
        let aba1 = aba;
        if (Curry.prototype.isPrototypeOf(aba)) {
            // for ignore index and array optional parameters
            aba1 = (accumulator, currentValue) => {
                return aba(accumulator, currentValue);
            };
        }
        return super.reduceRight(aba1, a);
    }

    traverse(afb) {
        // traverse :: (Applicative f, Traversable t) => t a ~> (a -> f b) -> f (t b)
        // instance Traversable [] where
        //     traverse f xs = foldr (\x v -> (:) <$> f x <*> v) (pure []) xs
        let t = this.constructor;
        if (this.length == 0) {
            return t.of();
        }
        // TODO concat  curry 化
        // concat :: t a -> t a -> t a
        // concat :: [a] -> [a] -> [a]
        let concat = (a1, a2) => {
            return a1.concat(a2);
        };
        concat = Curry.from(concat);
        // tOf :: a -> t a
        let tOf = x => t.of(x);
        // ataConcat = fmap (t a -> t a -> t a) -> (a -> t a)
        // ataConcat = fmap ([a] -> [a] -> [a]) -> (a -> [a])
        // ataConcat :: a -> t a -> t a
        // ataConcat :: a -> [a] -> [a]
        let ataConcat = concat.fmap(tOf);
        let aLast = this[this.length - 1];
        // fbLast :: f b
        let fbLast = transform(afb(aLast));
        let f = fbLast.constructor;
        // init :: f ( t b )
        let init = f.of(t.of());
        // ftbtbLast = fmap (a -> t a -> t a) f b
        // ftbtbLast :: f (t b -> t b)
        let ftbtbLast = fbLast.map(ataConcat);
        // ftbLast = f (t b) <**> f (t b -> t b)
        // ftbLast = f (t b)
        let ftbLast = init.ap(ftbtbLast);
        let theRest = this.slice(0, this.length - 1);
        let result = theRest.reduceRight((v, x) => {
            // fb :: f b
            let fb = afb(x);
            fb = transform(fb);
            // fb_concat = f b <&> (a -> t a -> t a)
            // fb_concat = (a -> t a -> t a) <$> f b
            // fb_concat = fmap (a -> t a -> t a) f b
            // apply (a -> t a -> t a) to b which extracting from f b, so it become ([b] -> [b])
            // fb_concat = f b <&> (a -> [a] -> [a])
            // fb_concat = map f b (a -> [a] -> [a])
            // fb_concat = (a -> [a] -> [a]) <$> f b
            // fb_concat = fmap (a -> [a] -> [a]) f b
            // fb_concat :: f (t b -> t b)
            // fb_concat :: f ([b] -> [b])
            let fb_concat = fb.map(ataConcat);
            // result = f (t b) <**> f (t b -> t b)
            // result :: f (t b)
            // result :: f [b]
            let result = v.ap(fb_concat);
            return result;
        }, ftbLast);
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

export {List};
