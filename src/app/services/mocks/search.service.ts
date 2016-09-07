import {SearchService} from '../search.service';
import Spy = jasmine.Spy; // eslint-disable-line no-undef

export class MockSearchService {

    spy;
    getAllSpy: Spy;
    getByIdSpy: Spy;
    searchSpy: Spy;
    saveSpy: Spy;
    fakeResponse;

    constructor() {
        this.spy = jasmine.createSpy;
        this.fakeResponse = null;
        this.getAllSpy = this.spy('getAll').andReturn(this);
        this.getByIdSpy = this.spy('get').andReturn(this);
        this.searchSpy = this.spy('search').andReturn(this);
        this.saveSpy = this.spy('save').andReturn(this);
    }

    subscribe(callback: Function | any) {
        callback(this.fakeResponse);
    }

    setResponse(json: any): void {
        this.fakeResponse = json;
    }

    getProviders(): Array<any> {
        return [
            { provide: SearchService, useValue: this }
        ];
    }
}
