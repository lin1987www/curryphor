import {mix} from '../mix';
import {Applicative} from './Applicative';
import {Chain} from './Chain';

let Monad = mix('Monad', [Applicative, Chain]);

export {Monad};