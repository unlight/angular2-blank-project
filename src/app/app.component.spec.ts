import { AppComponent } from './app.component';

describe('App tests', () => {

    it('smoke', () => {
        expect(AppComponent).toBeDefined();
    });

    it('instance', () => {
        let appComponent = new AppComponent();
        expect(appComponent.name).toBe('Angular');
    });
});
