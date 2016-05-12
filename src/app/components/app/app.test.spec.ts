import {SearchService} from 'services';
import {NameListService} from '../../services/name-list.service';
import {describe, it, expect, beforeEach} from '@angular/core/testing';
// import {fit} from '@angular/core/testing';

describe('App test', () => {

    beforeEach(() => {
        //
    });

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