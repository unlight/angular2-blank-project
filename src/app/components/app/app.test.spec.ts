import {SearchService} from '../../services/search.service';
import {NameListService} from '../../services/name-list.service';

describe('App test', () => {

    it('smoke test', () => {
        expect(NameListService).toBeDefined();
    });

});
