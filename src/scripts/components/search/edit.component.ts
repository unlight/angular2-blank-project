import {Component, OnInit} from '@angular/core';
import {Person, Address, SearchService} from '../../services/search.service';
// import {RouteParams, Router} from '@angular/router'; // Replaced by RouteSegment
import {URLSearchParams} from '@angular/http';
import {ComponentInstruction} from '@angular/router-deprecated';
import {Router, CanDeactivate} from '@angular/router';

@Component({
    selector: 'sd-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit, CanDeactivate {

    person: Person;
    editName: string;
    editPhone: string;
    editAddress: Address;

    constructor(
        private _service: SearchService,
        private _router: Router,
        // private _routeParams: RouteParams
        private _routeParams: URLSearchParams
    ) { 
        debugger;
    }

    ngOnInit() {
        let id = +this._routeParams.get('id');
        this._service.get(id).subscribe(person => {
            if (person) {
                this.editName = person.name;
                this.editPhone = person.phone;
                this.editAddress = person.address;
                this.person = person;
            } else {
                this.gotoList();
            }
        });
    }

    routerCanDeactivate(next: any, prev: any): any {
        if (!this.person || this.person.name === this.editName || this.person.phone === this.editPhone
            || this.person.address === this.editAddress) {
            return true;
        }

        return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
    }

    cancel() {
        this._router.navigate(['Search']);
    }

    save() {
        this.person.name = this.editName;
        this.person.phone = this.editPhone;
        this.person.address = this.editAddress;
        this._service.save(this.person);
        this.gotoList();
    }

    gotoList() {
        if (this.person) {
            this._router.navigate(['Search', { term: this.person.name }]);
        } else {
            this._router.navigate(['Search']);
        }
    }
}
