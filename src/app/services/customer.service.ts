import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {ICustomer} from "../interfaces/ICustomer";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomerList() {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getCustomerWithPaginationList() {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_ALL_WITH_PAGINATION + '/' + 1;
    return this.http.get<any>(myLink).pipe(
      map(res => res.customers)
    );
  }

  createOrUpdateCustomer(cliente: ICustomer): Observable<any> {
    return this.http.post<any>(environment.urlApi + environment.CUSTOMER_CREATE_OR_UPDATE, cliente).pipe(
      map(res => res.data)
    );
  }

  getCustomerById(id: number) {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_BY_ID + '/' + id;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  deleteCustomer(id: number): Observable<any> {
    const myLink = environment.urlApi + environment.CUSTOMER_DELETE + '/' + id;
    return this.http.delete<any>(myLink);
  }
}

