import {Curry} from './data/Curry';
import {List} from './data/List';

function transform(data) {
    if (Function.prototype.isPrototypeOf(data) && !Curry.prototype.isPrototypeOf(data)) {
        data = Curry.from(data);
    } else if (Array.prototype.isPrototypeOf(data) && !List.prototype.isPrototypeOf(data)) {
        data = List.from(data);
    }
    return data;
}

let id = (x) => x;

export {transform, id};