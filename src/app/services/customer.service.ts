import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {ICustomer} from "../interfaces/ICustomer";
import {IUser} from "../interfaces/IUser";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public customers: BehaviorSubject<ICustomer[]> = new BehaviorSubject<ICustomer[]>([]);

  constructor(private http: HttpClient) {
    this.getCustomerList().subscribe(customers => {
      this.customers.next(customers);
    })
  }



  getCustomerList() {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getCustomerWithPaginationList(orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_ALL_WITH_PAGINATION +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getCustomerWithPaginationListSearch(word: string, orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.CUSTOMER_GET_ALL_WITH_PAGINATION_SEARCH +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
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

