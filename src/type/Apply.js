import Functor from './Functor'

class Apply extends Functor {
    static ap(fab, fa) {
        // 自從有 Applicative 後 lift 就不常用了
        // (<*>)
        // ap :: f (a -> b) -> f a -> f b
        return fa.ap(fab);
    }

    // Applicative Functor
    constructor() {
        super();
        console.log('Apply');
    }

    ap(fab) {
        console.log('Apply.[[Prototype]].ap');
        // 跟 Haskell 定義相反，但是結果一致! 由 fab fa 的巢狀結構
        // Apply f => f a ~> f (a -⁠> b) -⁠> f b
    }
}

export default Apply;