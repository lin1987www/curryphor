import Curry_test from './Curry.test';
import List_test from './List.test';
import Cont_test from './Cont.test';
import function_test from './function.test';
import {List} from '../src/data/List';
import {Curry} from '../src/data/Curry';
import {Cont} from '../src/data/Cont';

if (typeof module !== 'undefined' && module.exports) {
    // is node
} else {
    // is browser
    window.List = List;
    window.Curry = Curry;
    window.Cont = Cont;
}