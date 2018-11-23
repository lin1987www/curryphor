import List_test from './List.test'
import Curry_test from './Curry.test'
import List from '../src/data/List';
import Curry from '../src/data/Curry';

import {curry, ccurry} from '../src/curry';


if (typeof module !== 'undefined' && module.exports) {
    // is node
} else {
    // is browser
    window.List = List;
    window.Curry = Curry;
    window.curry = curry;
    window.ccurry = ccurry;
}