import {transform} from '../utility';
import {mix} from '../mix';
import {Monad} from '../type/Monad';

const ContBase = mix('ContBase', [Monad, Function], Function);

/*
* Continuation
* newtype Cont r a = Cont {runCont :: (a -> r) -> r }
* Cont r a meaning take (a -> r) function apply to its own value a, then return r.
* */
class Cont extends ContBase {

    static of(a) {
        a = transform(a);
        const func = cont.bind(null, a);
        return create(func);
    }

    static from(func) {
        return create(func);
    }

    constructor(func) {
        super();
        return create(func);
    }


    map(ab) {
        // map :: Cont r a ~> (a -> b) -> Cont r b
        ab = transform(ab);
        return Cont.from(br =>
            this(a =>
                br(ab(a))
            )
        );
    }

    ap(cont_r_ab) {
        // ap :: Cont r a ~> Cont r (a -> b) -> Cont r b
        return Cont.from(br =>
            this(a =>
                cont_r_ab(ab =>
                    br(ab(a))
                )
            )
        );
    }

    chain(a_cont_r_b) {
        // chain :: Cont r a ~> (a -> Cont r b) -> Cont r b
        return Cont.from(br =>
            this(a =>
                a_cont_r_b(a)(b =>
                    br(b)
                )
            )
        );
    }
}

function cont(a, r) {
    return r(a);
}

function create(func, instance) {
    instance = instance || Object.create(Cont.prototype);
    Object.setPrototypeOf(func, instance);
    // bind functions
    let p = Cont.prototype;
    // Monad
    instance.map = p.map.bind(func);
    instance.ap = p.ap.bind(func);
    instance.chain = p.chain.bind(func);
    instance.cchain = p.cchain.bind(func);
    return func;
}

export {Cont};