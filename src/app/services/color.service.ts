import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {IColor} from "../interfaces/IColor";

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public colors: BehaviorSubject<IColor[]> = new BehaviorSubject<IColor[]>([]);

  constructor(private http: HttpClient) {
    this.getColorList().subscribe(colors => {
      this.colors.next(colors);
    })
  }



  getColorList() {
    const myLink = environment.urlApi + environment.COLOR_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getColorWithPaginationList(orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.COLOR_GET_ALL_WITH_PAGINATION +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  getColorWithPaginationListSearch(word: string, orderBy: string, ascDesc: string, perPage: number, page: number) {
    const myLink = environment.urlApi + environment.COLOR_GET_ALL_WITH_PAGINATION_SEARCH +
      '/' + word +
      '/' + orderBy + '/' + ascDesc +
      '/' + perPage + '/' + page;
    return this.http.get<any>(myLink).pipe(
      map(res => res)
    );
  }

  createOrUpdateColor(color: IColor): Observable<any> {
    return this.http.post<any>(environment.urlApi + environment.COLOR_CREATE_OR_UPDATE, color).pipe(
      map(res => res.data)
    );
  }

  deleteColor(id: number): Observable<any> {
    const myLink = environment.urlApi + environment.COLOR_DELETE + '/' + id;
    return this.http.delete<any>(myLink);
  }
}

