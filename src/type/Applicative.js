import Apply from './Apply'

class Applicative extends Apply {
    static of(...a) {
        console.log('Applicative.of');
    }

    // Applicative pure
    constructor() {
        super();
    }
}

export default Applicative;