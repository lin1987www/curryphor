import {Chain} from './Chain';

// chainRec :: ChainRec m
//     => ((a -> c, b -> c, a) -> m c, a)
//     -> m b
//
// chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b
// > S.chainRec (Array) (s => s.length === 2 ? S.map (S.Right) ([s + '!', s + '?']) : S.map (S.Left) ([s + 'o', s + 'n'])) ('')
// ["oo!", "oo?", "on!", "on?", "no!", "no?", "nn!", "nn?"]
//
// chainRec :: ChainRec m => ((a -> c, b -> c, a) -> m c, a) -> m b
//
// http://www.tomharding.me/2017/05/30/fantas-eel-and-specification-14/
// https://stackoverflow.com/questions/48967530/how-to-implement-a-stack-safe-chainrec-operator-for-the-continuation-monad
// https://github.com/fantasyland/fantasy-land/tree/v3.5.0#chainrec


class ChainRec extends Chain {


}

export {ChainRec};