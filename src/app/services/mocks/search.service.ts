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
        this.getAllSpy = this.spy('getAll').and.returnValue(this);
        this.getByIdSpy = this.spy('get').and.returnValue(this);
        this.searchSpy = this.spy('search').and.returnValue(this);
        this.saveSpy = this.spy('save').and.returnValue(this);
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
