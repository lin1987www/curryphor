import Foldable from "../type/Foldable";
import Monoid from "../type/Monoid";
import ListMonad from "./ListMonad";
import mix from "../mix";

let List = mix('List', Foldable, Monoid, ListMonad, Array);

export default List;