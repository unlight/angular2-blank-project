import {SearchService} from '../../services/search.service';
import {NameListService} from '../../services/name-list.service';
import {describe, expect, beforeEach} from '@angular/core/testing';

describe('App test', () => {

    it('smoke test', () => {
        expect(NameListService).toBeDefined();
    });

});
