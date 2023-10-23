import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {IOrder} from "../interfaces/IOrder";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  getOrderList() {
    const myLink = environment.urlApi + environment.ORDER_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getOrderWithPaginationList(orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_ALL_WITH_PAGINATION +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getOrderWithPaginationListSearch(word: string, orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_ALL_WITH_PAGINATION_SEARCH +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getOrderWithPaginationListSearchProvider(word: string | null, orderBy: string, ascDesc: string, perPage: number, page: number, idProvider: number, idSeason: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_ALL_WITH_PAGINATION_SEARCH_PROVIDER +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page +
      '/' + idProvider + '/' + idSeason;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getOrderProviderXLSX(idProvider: number, idSeason: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_ALL_PROVIDER_XLSX +
      '/' + idProvider + '/' + idSeason;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }


  createOrUpdateOrder(order: IOrder): Observable<any> {
    return this.http.post<any>(environment.urlApi + environment.ORDER_CREATE_OR_UPDATE, order).pipe(
      map(res => res.data)
    );
  }

  getOrderById(id: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_BY_ID + '/' + id;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  deleteOrder(order: IOrder): Observable<any> {
    const myLink = environment.urlApi + environment.ORDER_DELETE;
    return this.http.post<any>(myLink, order);
  }

  getTotalPiecesAndAmounts() {
    const myLink = environment.urlApi + environment.ORDER_GET_TOTAL_PIECES_AND_AMOUNTS;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getTotalPiecesAndAmountsPDF() {
    const myLink = environment.urlApi + environment.ORDER_GET_TOTAL_PIECES_AND_AMOUNTS_PDF;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getTotalPiecesAndAmountsProvider(idProvider: number, idSeason: number) {
    const myLink = environment.urlApi + environment.ORDER_GET_TOTAL_PIECES_AND_AMOUNTS_PROVIDER +
    '/' + idProvider + '/' + idSeason;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }
}

