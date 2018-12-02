import {mix} from '../mix';
import {Foldable} from "./Foldable";
import {Functor} from "./Functor";

const TraversableInterface = mix('TraversableInterface', [Functor, Foldable]);

class Traversable extends TraversableInterface {

    constructor() {
        super();
    }

    traverse(afb) {
        // class (Functor t, Foldable t) => Traversable t where
        //
        // traverse :: (Applicative f, Traversable t)  => (a -> f b) -> t a -> f (t b)
        // applying reduce function to (f (t b) -> a -> f (t b)) -> f (t b) -> t a for getting f (t b)
        //
        // In (f (t b) -> a -> f (t b)) function
        //      applying (a -> f b) function to a for getting f b
        //      applying Functor map function to (b -> t b -> t b) and f b for getting f (t b -> t b)
        //      applying Applicative ap function to f (t b -> t b) and f (t b) for getting f (t b)
        //
        // (b -> t b -> t b) would be (t b -> t b -> t b) compose (b -> t b)
        // (t b -> t b -> t b) like  Semigroup concat method which instance of t
        // (b -> t b) like Applicative of method which instance of t


        // sequenceA :: (Applicative f, Traversable t) => t (f a) -> f (t a)
        // mapM :: Monad m => (a -> m b) -> t a -> m (t b)
        // sequence :: (Monad m, Traversable t) => t (m a) -> m (t a)

        // traverse f = sequenceA . fmap f
        // sequenceA = traverse id

        // Fantasy Land
        // traverse :: (Applicative f, Traversable t) => (TypeRep f, a -⁠> f b, t a) -⁠> f (t b)

        // http://hackage.haskell.org/package/base-4.12.0.0/docs/Data-Traversable.html#v:traverse
        // https://zh.wikibooks.org/zh-tw/Haskell/Traversable%E7%B1%BB%E5%9E%8B%E7%B1%BB

        console.log('Traversable.[[prototype]].traverse');
    }

    sequenceA() {
        // sequenceA :: Applicative f => t (f a) -> f (t a)
        return this.traverse(x => x);
    }
}

export {Traversable};