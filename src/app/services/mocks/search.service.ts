import {provide} from '@angular/core';
import {SpyObject} from '@angular/testing/testing_internal';
import {SearchService} from '../search.service';
import Spy = jasmine.Spy;

export class MockSearchService extends SpyObject {
  getAllSpy:Spy;
  getByIdSpy:Spy;
  searchSpy:Spy;
  saveSpy:Spy;
  fakeResponse;

  constructor() {
    super(SearchService);

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
    return [provide(SearchService, {useValue: this})];
  }
}
