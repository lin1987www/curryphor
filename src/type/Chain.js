import {Apply} from './Apply';

class Chain extends Apply {
    static chain(ma, amb) {
        // chain :: Chain m => m a -> (a -> m b) -> m b
        // extracting a from m a
        // apply (a -> m b) function to a for getting m b
        // m b is result
        return ma.chain(amb);
    }

    // Monad (>>=) do
    constructor() {
        super();
    }

    chain(amb) {
        try {
            // Chain m => m a ~> (a -> m b) -> m b
            return this.cchain(amb);
        }
        catch (e) {
            return this.fail(e);
        }
    }

    cchain (amb) {
        console.log('Chain.[[Prototype]].mchain');
        // Chain m => m a ~> (a -> m b) -> m b
    }

    fail (e) {
        throw e;
    }
}

export {Chain};