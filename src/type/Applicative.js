import {Apply} from './Apply'

class Applicative extends Apply {
    static of(...a) {
        // of :: a -> f a
        // Lift a value
        console.log('Applicative.of');
    }

    // Applicative pure
    constructor() {
        super();
    }
}

export {Applicative};