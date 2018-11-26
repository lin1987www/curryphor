import List_test from './List.test'
import Curry_test from './Curry.test'
import function_test from './function.test'
import List from '../src/data/List';
import Curry from '../src/data/Curry';
import {options, AppendOptionalArgs} from "../src/data/Curry";


if (typeof module !== 'undefined' && module.exports) {
    // is node
} else {
    // is browser
    window.List = List;
    window.Curry = Curry;
    window.optional = options;
    window.AppendOptionalArgs = AppendOptionalArgs;
}