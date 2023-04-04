import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUser} from "../interfaces/IUser";
import {IColor} from "../interfaces/IColor";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ISize} from "../interfaces/ISize";
import {IProvider} from "../interfaces/IProvider";
import {IProductType} from "../interfaces/IProductType";
import {BreakpointObserver} from "@angular/cdk/layout";
import {ISimplePickList} from "../interfaces/ISimplePickList";

@Injectable({
  providedIn: 'root',
})
export class CommonService {


  public utenti: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);

  public colori: BehaviorSubject<IColor[]> = new BehaviorSubject<IColor[]>([]);

  public taglieAbbigliamento: BehaviorSubject<ISize[]> = new BehaviorSubject<ISize[]>([]);

  public tagliaScarpe: BehaviorSubject<ISize[]> = new BehaviorSubject<ISize[]>([]);

  public fornitori: BehaviorSubject<IProvider[]> = new BehaviorSubject<IProvider[]>([]);

  public tipologiaProdotti: BehaviorSubject<IProductType[]> = new BehaviorSubject<IProductType[]>([]);

  public deliveryList: BehaviorSubject<ISimplePickList[]> = new BehaviorSubject<ISimplePickList[]>([]);

  public orderTypeList: BehaviorSubject<ISimplePickList[]> = new BehaviorSubject<ISimplePickList[]>([]);

  public paymentMethodsList: BehaviorSubject<ISimplePickList[]> = new BehaviorSubject<ISimplePickList[]>([]);

  public seasonTypeList: BehaviorSubject<ISimplePickList[]> = new BehaviorSubject<ISimplePickList[]>([]);


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

    this.getDeliveryList().subscribe(deliveryList => {
      this.deliveryList.next(deliveryList);
    });

    this.getOrderTypeList().subscribe(orderTypeList => {
      this.orderTypeList.next(orderTypeList);
    });

    this.getPaymentMethodsList().subscribe(paymentMethodsList => {
      this.paymentMethodsList.next(paymentMethodsList);
    });

    this.getSeasonTypeList().subscribe(seasonTypeList => {
      this.seasonTypeList.next(seasonTypeList);
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


  getDeliveryList() {
    const myLink = environment.urlApi + environment.DELIVERY_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getOrderTypeList() {
    const myLink = environment.urlApi + environment.ORDER_TYPE_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getPaymentMethodsList() {
    const myLink = environment.urlApi + environment.PAYMENT_METHODS_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

  getSeasonTypeList() {
    const myLink = environment.urlApi + environment.SEASON_TYPE_GET_ALL;
    return this.http.get<any>(myLink).pipe(
      map(res => res.data)
    );
  }

}

