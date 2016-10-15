import { NgModule, Injectable, Type, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ResolvedReflectiveProvider } from '@angular/core';
import { RuntimeCompiler } from '@angular/compiler';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WindowViewCanClose } from './window-view-can-close';
import { WindowViewContainerComponent} from './..';
import { CommonModule } from '@angular/common';
// import { WindowViewLayerService } from './window-view-layer.service';


@Injectable()
export class WindowViewService {

    private stack: ComponentRef<any>[] = [];

    private outlet: ViewContainerRef;

    private _length$: Subject<number> = new Subject<number>();

    private _open$: Subject<any> = new Subject<any>();

    private _close$: Subject<any> = new Subject<any>();

    get length(): number { return this.stack.length; }

    /**
     * Current window's count.
     */
    get length$(): Observable<number> { return this._length$.asObservable(); }

    /**
     * Emit after window open.
     */
    get open$(): Observable<any> { return this._open$.asObservable(); }

    /**
     * Emit before window close.
     */
    get close$(): Observable<any> { return this._close$.asObservable(); }

    constructor(
        private componentResolver: ComponentFactoryResolver,
        private runtimeCompiler: RuntimeCompiler
    ) { }

    setOutlet(outlet: ViewContainerRef) {
        this.outlet = outlet;
    }

    getInstanceAt(index: number) {
        return (this.stack[index]) ? this.stack[index].instance : null;
    }

    add(componentRef: ComponentRef<any>) {
        this.stack.push(componentRef);
        this._open$.next(componentRef.instance);
        this._length$.next(this.stack.length);
    }

    remove(componentRef: ComponentRef<any>): boolean {
        if (!this.canCloseWindowView(componentRef)) {
            return false;
        }
        let index: number = this.stack.indexOf(componentRef);
        this.stack.splice(index, 1);
        this._close$.next(componentRef.instance);
        this._length$.next(this.stack.length);
        componentRef.destroy();
        return true;
    }

    removeByInstance(instance: any) {
        let removedComponentRef: ComponentRef<any> = this.stack.find((componentRef: ComponentRef<any>) =>
            componentRef.instance === instance);
        return this.remove(removedComponentRef);
    }

    private buildRuntimeComponentModule(DynamicComponent) {
        // Dynamic module
        @NgModule({
            // Module with heading directives etc.
            imports: [
                CommonModule
            ],
            declarations: [
                WindowViewContainerComponent,
                // WindowViewLayerService,
                DynamicComponent
            ]
        })
        class RuntimeComponentModule { }

        return RuntimeComponentModule;
    }

    private static _cache = new Map<Type, ComponentFactory>();

    openWindow<T>(DynamicComponent) {
        // debugger;
        let factory = WindowViewService._cache.get(DynamicComponent);
        return Promise.resolve(factory)
            .then(factory => {
                if (factory) return factory;
                let runtimeComponentModule = this.buildRuntimeComponentModule(DynamicComponent);
                return this.runtimeCompiler
                    .compileModuleAndAllComponentsAsync(runtimeComponentModule)
                    .then((moduleWithFactories) => {
                        // find THE factory (TODO should use deeper comparison to be sure)
                        let factory = moduleWithFactories.componentFactories.find(moduleWithFactory => {
                            return moduleWithFactory.componentType['name'] === DynamicComponent['name']
                        });
                        WindowViewService._cache.set(DynamicComponent, factory);
                        return factory;
                    });
            })
            .then(factory => {
                var componentRef: ComponentRef<T> = this.outlet.createComponent(factory);
                this.add(componentRef);
                return componentRef;
            });
    }

    /**
     * Add window to top.
     */
    pushWindow<T>(Component: Type<T>, providers: ResolvedReflectiveProvider[] = []): Promise<ComponentRef<T>> {
        if (!this.outlet) {
            throw new Error('[WindowViewService] pushWindow error. Not found window-view-outlet');
        }
        // resolveComponentFactory(component: Type<T>) : ComponentFactory<T>
        let factory = this.componentResolver.resolveComponentFactory(Component);
        var componentRef: ComponentRef<T> = this.outlet.createComponent(factory);
        this.add(componentRef);
        return Promise.resolve(componentRef);
    }

    /**
     * Remove latest window.
     */
    popWindow(): boolean {
        if (this.stack.length === 0) {
            return false;
        }
        let componentRef: ComponentRef<any> = this.stack[this.stack.length - 1];
        return this.remove(componentRef);
    }

    private canCloseWindowView(componentRef: ComponentRef<WindowViewCanClose>) {
        if (typeof componentRef.instance.windowViewCanClose !== 'function') { // eslint-disable-line lodash/prefer-lodash-typecheck
            return true;
        }
        return componentRef.instance.windowViewCanClose();
    }

}
