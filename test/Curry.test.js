import Curry from "../src/data/Curry";

import {curry, ccurry} from '../src/curry';
const {assert, expect, should} = require('chai');

describe('Curry', function () {
    describe('#constructor()', function () {
        it('should instanceof', function () {
            let f = new Curry(() => {
            });
            assert.equal(f instanceof Curry, true);
            assert.typeOf(f, 'function');
        });

        it('apply', function () {
            let f = ccurry(function (x,y) {
                console.log(this);
                return x+y;
            });
            let f1 = f(9);
            // assert.equal(f1(3), 12);
            let f2 = f.apply('',[9]);
            assert.equal(f2(3),12);
        });
    });
});