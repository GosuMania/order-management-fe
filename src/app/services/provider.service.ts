import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {IProvider} from "../interfaces/IProvider";

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  public providers: BehaviorSubject<IProvider[]> = new BehaviorSubject<IProvider[]>([]);

  constructor(private http: HttpClient) {
    this.getProviderList().subscribe(providers => {
      this.providers.next(providers);
    })
  }



  getProviderList() {
    const myLink = environment.urlApi + environment.PROVIDER_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getProviderWithPaginationList(orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.PROVIDER_GET_ALL_WITH_PAGINATION +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getProviderWithPaginationListSearch(word: string, orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.PROVIDER_GET_ALL_WITH_PAGINATION_SEARCH +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  createOrUpdateProvider(cliente: IProvider): Observable<any> {
    return this.http.post<any>(environment.urlApi + environment.PROVIDER_CREATE_OR_UPDATE, cliente).pipe(
      map(res => res.data)
    );
  }

  getProviderById(id: number) {
    const myLink = environment.urlApi + environment.PROVIDER_GET_BY_ID + '/' + id;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  deleteProvider(id: number): Observable<any> {
    const myLink = environment.urlApi + environment.PROVIDER_DELETE + '/' + id;
    return this.http.delete<any>(myLink);
  }
}

