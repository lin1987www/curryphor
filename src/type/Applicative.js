import Apply from './Apply'

class Applicative extends Apply {
    static of(a) {
        console.log('Applicative.of ' + this.name);
    }

    // Applicative pure
    constructor() {
        super();
        console.log('Applicative');
    }

    of(a) {
        console.log('Applicative.[[Prototype]].of ' + this.name);
    }
}

export default Applicative;