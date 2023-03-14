import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUtente} from "../interfaces/IUtente";
import {IColore} from "../interfaces/IColore";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ITaglia} from "../interfaces/ITaglia";
import {IProvider} from "../interfaces/IProvider";
import {IProductType} from "../interfaces/IProductType";
import {BreakpointObserver} from "@angular/cdk/layout";

@Injectable({
  providedIn: 'root',
})
export class CommonService {


  public utenti: BehaviorSubject<IUtente[]> = new BehaviorSubject<IUtente[]>([]);

  public colori: BehaviorSubject<IColore[]> = new BehaviorSubject<IColore[]>([]);

  public taglieAbbigliamento: BehaviorSubject<ITaglia[]> = new BehaviorSubject<ITaglia[]>([]);

  public tagliaScarpe: BehaviorSubject<ITaglia[]> = new BehaviorSubject<ITaglia[]>([]);

  public fornitori: BehaviorSubject<IProvider[]> = new BehaviorSubject<IProvider[]>([]);

  public tipologiaProdotti: BehaviorSubject<IProductType[]> = new BehaviorSubject<IProductType[]>([]);

  public isSmall: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {
    this.getColorList().subscribe(colors => {
      this.colori.next(colors);
    });

    this.getClothingSizeList().subscribe(clothingSizes => {
      this.taglieAbbigliamento.next(clothingSizes);
    });

    this.getShoesSizeList().subscribe(shoeSizes => {
      this.tagliaScarpe.next(shoeSizes);
    });

    this.getProductTypeList().subscribe(productTypes => {
      this.tipologiaProdotti.next(productTypes);
    });

    this.getProviderList().subscribe(providers => {
      this.fornitori.next(providers);
    });

    this.breakpointObserver.observe(['(max-width: 900px)']).subscribe((res) => {
      setTimeout(() => {
        this.isSmall.next(res.matches);
      }, 300);
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
  getShoesSizeList() {
    const myLink = environment.urlApi + environment.SHOE_SIZE_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

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


  uploadImage(image: File | undefined): Observable<any> {
    const formData = new FormData();
    const myLink = environment.urlApi + environment.UTILITY_UPLOAD_IMAGE;
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-denylist, id-match
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (image)
      formData.append('image', image);

    return this.http.post(myLink, formData, {responseType: 'json'});
  }

}

