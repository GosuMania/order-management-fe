import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {IProduct} from "../interfaces/IProduct";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductList() {
    const myLink = environment.urlApi + environment.PRODUCT_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getProductWithPaginationList(orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.PRODUCT_GET_ALL_WITH_PAGINATION +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getProductWithPaginationListSearch(word: string, orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.PRODUCT_GET_ALL_WITH_PAGINATION_SEARCH +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  createOrUpdateProduct(product: IProduct): Observable<any> {
    return this.http.post<any>(environment.urlApi + environment.PRODUCT_CREATE_OR_UPDATE, product).pipe(
      map(res => res.data)
    );
  }

  getProductById(id: number) {
    const myLink = environment.urlApi + environment.PRODUCT_GET_BY_ID + '/' + id;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  deleteProduct(id: number): Observable<any> {
    const myLink = environment.urlApi + environment.PRODUCT_DELETE + '/' + id;
    return this.http.delete<any>(myLink);
  }
}

