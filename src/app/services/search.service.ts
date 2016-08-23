import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SearchService {

    constructor(private http: Http) { }

    // getAll() {
    //     return this.http.get('http://api.randomuser.me/?results=5')
    //         .map((res: Response) => res.json().results);
    // }

    getAll() {
        return Observable.create(function(observer: any) {
            observer.next([
                {
                    'id': 1,
                    'name': 'Peyton Manning',
                    'phone': '(303) 567-8910',
                    'address': {
                        'street': '1234 Main Street',
                        'city': 'Greenwood Village',
                        'state': 'CO',
                        'zip': '80111'
                    }
                },
                {
                    'id': 2,
                    'name': 'Demaryius Thomas',
                    'phone': '(720) 213-9876',
                    'address': {
                        'street': '5555 Marion Street',
                        'city': 'Denver',
                        'state': 'CO',
                        'zip': '80202'
                    }
                },
                {
                    'id': 3,
                    'name': 'Von Miller',
                    'phone': '(917) 323-2333',
                    'address': {
                        'street': '14 Mountain Way',
                        'city': 'Vail',
                        'state': 'CO',
                        'zip': '81657'
                    }
                }
            ]);
            observer.complete();
        });
    }

    search(q: string) {
        q = (!q || q === '*') ? '' : q.toLowerCase();
        return this.getAll().map(data => {
            let results = [];
            data.map(item => {
                // check for item in localStorage
                if (localStorage['person' + item.id]) {
                    item = JSON.parse(localStorage['person' + item.id]);
                }
                if (JSON.stringify(item).toLowerCase().indexOf(q) !== -1) { // eslint-disable-line lodash/prefer-includes
                    results.push(item);
                }
                // if (JSON.stringify(item).toLowerCase().includes(q)) {
                //   results.push(item);
                // }
            });
            return results;
        });
    }

    get(id: number) {
        return this.getAll().map(all => {
            if (localStorage['person' + id]) {
                return JSON.parse(localStorage['person' + id]);
            }
            return all.find(e => e.id === id);
        });
    }

    save(person: Person) {
        localStorage['person' + person.id] = JSON.stringify(person);
    }
}

export class Address {
    street: string;
    city: string;
    state: string;
    zip: string;


    constructor(obj?: any) {
        this.street = obj && obj.street || null;
        this.city = obj && obj.city || null;
        this.state = obj && obj.state || null;
        this.zip = obj && obj.zip || null;
    }
}

export class Person {
    id: number;
    name: string;
    phone: string;
    address: Address;

    constructor(obj?: any) {
        this.id = obj && Number(obj.id) || null;
        this.name = obj && obj.name || null;
        this.phone = obj && obj.phone || null;
        this.address = obj && obj.address || null;
    }
}
