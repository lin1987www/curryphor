import mix from '../mix';
import Foldable from "./Foldable";
import Applicative from "./Applicative";

const TraversableInterface = mix('TraversableInterface', [Applicative, Foldable]);

class Traversable extends TraversableInterface {

    constructor() {
        super();
    }

    traverse(afb) {
        console.log('Traversable.[[prototype]].traverse');
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
}

export default Traversable;