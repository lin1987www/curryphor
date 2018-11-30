import mix from '../mix';
import Functor from "./Functor";
import Foldable from "./Foldable";

const TraversableInterface = mix('TraversableInterface', [Functor, Foldable]);

class Traversable extends TraversableInterface {

    static traverse(afb, ta) {
        console.log('Traversable.traverse');

        // traverse :: (Applicative f, Traversable t) => (TypeRep f, a -⁠> f b, t a) -⁠> f (t b)

        // traverse :: (Applicative f, Traversable t)  => (a -> f b) -> t a -> f (t b)
        // sequenceA :: (Applicative f, Traversable t) => t (f a) -> f (t a)
        // sequence :: (Monad m, Traversable t) => t (m a) -> m (t a)

        // traverse f = sequenceA . fmap f
        // sequenceA = traverse id

        // http://hackage.haskell.org/package/base-4.12.0.0/docs/Data-Traversable.html#v:traverse
        /*
        instance Traversable [] where
            traverse _ []     = pure []
            traverse f (x:xs) = (:) <$> f x <*> traverse f xs
        */
    }

    constructor() {
        super();
    }

    traverse(afb) {
        return this.constructor.traverse(afb, this);
    }
}

export default Traversable;