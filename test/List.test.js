import List from '../src/data/List';
const {assert, expect, should} = require('chai');  // Using Assert style

describe('List', function () {
    describe('#of()', function () {
        it('should equal', function () {
            expect(List.of()).to.deep.equal(new List());
            //  expect(List.of(1, 2, 3).chain(x => [x, x + 10])).to.deep.equal(List.of(1, 11, 2, 12, 3, 13));
        });
    });
});
