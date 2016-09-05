import {NameListService} from '../../services/name-list.service';
import * as assert from 'power-assert';

describe('App test', () => {

    it('smoke test', () => {
        expect(NameListService).toBeDefined();
    });

    it('dummy', () => { // eslint-disable-line
        var dummy = 'dummy';
        var bunny = 'bunny';
        assert.equal(dummy, bunny);
    });

    it('should fail', () => { // eslint-disable-line
        var ary = [1, 2, 3];
        var minusOne = -1;
        var two = 2;
        // expect(ary.indexOf(two)).toBe(-1);
        // Waiting for fix: https://github.com/power-assert-js/power-assert/issues/67
        assert(ary.indexOf(two) === minusOne, 'Assertion Message');
    });

});
