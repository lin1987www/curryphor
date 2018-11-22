import List from "./data/List";

export * from './type/Applicative.js';

console.log(List);

console.log(List.of(1, 2, 3).chain(x => [x, x + 10]));