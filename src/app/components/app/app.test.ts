import {SearchService} from 'services';
import {NameListService} from '../../services/name-list.service';
import {fdescribe, describe, fit, it, expect, beforeEach, injectAsync} from '@angular/core/testing';

describe('App test', () => {

    it('should be ok', () => {
        expect(1).toBe(1);
    });

    it('should be defined', () => {
        expect(SearchService).toBeDefined();
    });

    it('should be defined', () => {
        expect(NameListService).toBeDefined();
    });

});