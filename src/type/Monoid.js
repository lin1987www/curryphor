import Semigroup from "./Semigroup";

class Monoid extends Semigroup {
    constructor() {
        super();
        console.log('Semigroup');
    }

    empty() {
        // 這裡的 () 是直接沒有帶任何參數呼叫
        // empty :: Monoid a => () -> a
        // 而原本的 Haskell 設計是 常數
        // mempty :: Monoid a => a
    }

    mconcat() {
        //  mconcat :: Monoid a => [a] -> a
    }
}

export default Monoid;