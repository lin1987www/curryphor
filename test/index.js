import test from './List.test'
import List from '../src/data/List';

if (typeof module !== 'undefined' && module.exports) {
    // is node
} else {
    // is browser
    window.List = List;
}