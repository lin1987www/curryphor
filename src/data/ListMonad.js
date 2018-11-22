import Monad from "../type/Monad";

// TODO 修改 ap  chain 返回的結構 [] 改 List
class ListMonad extends Monad {
    constructor() {
        super();
        console.log('ListMonad');
        this.ap = this.ap.bind(this);
    }

    ap(fab) {
        // 跟 Haskell 定義相反，但是結果一致! 由 fab fa 的巢狀結構
        // Apply f => f a ~> f (a -⁠> b) -⁠> f b
        return fab.reduce((fb, ab) => {
            return fb.concat(
                this.reduce((fb, a) => {
                    fb.push(ab(a));
                    return fb;
                }, [])
            );
        }, []);
    }

    cchain(amb) {
        // Chain m => m a ~> (a -> m b) -> m b
        return this.reduce((mb, a) => {
            return mb.concat(amb(a));
        }, []);
    }
}

export default ListMonad;