import Monad from "../type/Monad";


class ListMonad extends Monad {
    constructor() {
        super();
        // this.ap = this.ap.bind(this);
    }

    ap(fab) {
        // 跟 Haskell 定義相反，但是結果一致! 由 fab fa 的巢狀結構
        // Apply f => f a ~> f (a -⁠> b) -⁠> f b
        return fab.reduce((fb, ab) => {
            return fb.concat(
                this.reduce((fb, a) => {
                    fb.push(ab(a));
                    return fb;
                }, this.of())
            );
        }, this.of());
    }

    of(...a) {
        return this.constructor.of(...a);
    }

    cchain(amb) {
        // Chain m => m a ~> (a -> m b) -> m b
        return this.reduce((mb, a) => {
            return mb.concat(amb(a));
        }, this.of());
    }

    fail(e) {
        return this.of();
    }
}

export default ListMonad;