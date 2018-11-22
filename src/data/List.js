import Foldable from "../type/Foldable";
import Monoid from "../type/Monoid";
import ListMonad from "./ListMonad";
import mix from "../mix";

let ListBase = mix('List', Foldable, Monoid, ListMonad, Array);

class List extends ListBase{
    constructor(){
        super();
        // create a new instance which we called self
        let self = [];
        let prototype = Object.getPrototypeOf(this);
        Object.setPrototypeOf(self, prototype);
        // bind with self
        self.ap = self.ap.bind(self);
        self.chain = self.chain.bind(self);
        // return self instance to replace this
        return self;
    }
}

export default List;