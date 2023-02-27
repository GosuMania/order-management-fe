import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUtente} from "../interfaces/IUtente";
import {IColore} from "../interfaces/IColore";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ITaglia} from "../interfaces/ITaglia";
import {IProvider} from "../interfaces/IProvider";
import {IProductType} from "../interfaces/IProductType";

@Injectable({
  providedIn: 'root',
})
export class CommonService {


  public utenti: BehaviorSubject<IUtente[]> = new BehaviorSubject<IUtente[]>([]);

  public colori: BehaviorSubject<IColore[]> = new BehaviorSubject<IColore[]>([]);

  public taglieAbbigliamento: BehaviorSubject<ITaglia[]> = new BehaviorSubject<ITaglia[]>([]);

  public fornitori: BehaviorSubject<IProvider[]> = new BehaviorSubject<IProvider[]>([]);

  public tipologiaProdotti: BehaviorSubject<IProductType[]> = new BehaviorSubject<IProductType[]>([]);


  constructor(private http: HttpClient) {
    this.getColorList().subscribe(colors => {
      this.colori.next(colors);
    });

    this.getClothingSizeList().subscribe(clothingSizes => {
      this.taglieAbbigliamento.next(clothingSizes);
    });

    this.getProductTypeList().subscribe(productTypes => {
      this.tipologiaProdotti.next(productTypes);
    });

    this.getProviderList().subscribe(providers => {
      this.fornitori.next(providers);
    });
  }

  getColorList() {
    const myLink = environment.urlApi + environment.COLOR_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getClothingSizeList() {
    const myLink = environment.urlApi + environment.CLOTHING_SIZE_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  // TODO GET SHOES SIZE LIST

  getProductTypeList() {
    const myLink = environment.urlApi + environment.PRODUCT_TYPE_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getProviderList() {
    const myLink = environment.urlApi + environment.PROVIDER_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }


}

