import {provide} from '@angular/core';
import {
    ComponentInstruction,
    Router,
    RouteParams
} from '@angular/router';
import {ResolvedInstruction} from 'angular2/src/router/instruction';
import {SpyObject} from '@angular/testing/testing_internal';

export class MockRouteParams extends SpyObject {
    private ROUTE_PARAMS = {};

    constructor() { super(RouteParams); }

    set(key: string, value: string) {
        this.ROUTE_PARAMS[key] = value;
    }

    get(key: string) {
        return this.ROUTE_PARAMS[key];
    }
}

export class MockRouter extends SpyObject {
    constructor() { super(Router); }
    isRouteActive(s: any) { return true; }
    generate(s: any) {
        // TODO: Definition file has not such signature.
        // var componentInstruction = new ComponentInstruction('detail', [], null, null, true, '0');
        var componentInstruction: ComponentInstruction = {
            urlPath: 'detail',
            urlParams: new Array<string>(),
            routeData: null,
            componentType: null,
            terminal: true,
            specificity: '0',
            params: null,
            reuse: false
        };
        return new ResolvedInstruction(componentInstruction, null, {});
    }
}

export class MockRouterProvider {
    mockRouter: MockRouter = new MockRouter();
    mockRouteParams: MockRouteParams = new MockRouteParams();

    setRouteParam(key: string, value: any) {
        this.mockRouteParams.set(key, value);
    }

    getProviders(): Array<any> {
        return [
            provide(Router, { useValue: this.mockRouter }),
            provide(RouteParams, { useValue: this.mockRouteParams }),
        ];
    }
}