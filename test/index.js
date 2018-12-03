import Curry_test from './Curry.test';
import List_test from './List.test';
import function_test from './function.test';
import {List} from '../src/data/List';
import {Curry} from '../src/data/Curry';


if (typeof module !== 'undefined' && module.exports) {
    // is node
} else {
    // is browser
    window.List = List;
    window.Curry = Curry;
}