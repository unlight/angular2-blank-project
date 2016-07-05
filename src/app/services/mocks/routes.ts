import {provide} from '@angular/core';
import {SpyObject} from '@angular/testing/src/testing_internal';
import {Router} from '@angular/router';

class MockRouteSegment {
    urlSegments: any;
    parameters: any;
    outlet: string;
    _type: any;
    _componentFactory: any;
    type: any;
    stringifiedUrlSegments: string;

    constructor(parameters?: { [key: string]: any; }) {
        this.parameters = parameters;
    }

    getParam(param: string) {
        return this.parameters[param];
    }
}

class MockRouteParams extends SpyObject {
    private ROUTE_PARAMS = {};

    set(key: string, value: string) {
        this.ROUTE_PARAMS[key] = value;
    }

    get(key: string) {
        return this.ROUTE_PARAMS[key];
    }
}

class MockRouter extends SpyObject {
    constructor() { super(Router); }
    isRouteActive(s: any) { return true; }
}

class MockRouterProvider {
    mockRouter: MockRouter = new MockRouter();
    mockRouteParams: MockRouteParams = new MockRouteParams();

    setRouteParam(key: string, value: any) {
        this.mockRouteParams.set(key, value);
    }

    getProviders(): Array<any> {
        return [
            provide(Router, { useValue: this.mockRouter })
            // provide(RouteParams, { useValue: this.mockRouteParams }),
            // provide(RouteSegment, { useClass: MockRouteSegment }),
        ];
    }
}
