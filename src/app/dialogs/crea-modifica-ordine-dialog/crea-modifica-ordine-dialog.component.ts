import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {IProduct} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColor} from "../../interfaces/IColor";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {ProviderService} from "../../services/provider.service";
import {OrderService} from "../../services/order.service";
import {CustomerService} from "../../services/customer.service";
import {ICustomer} from "../../interfaces/ICustomer";
import {ISimplePickList} from "../../interfaces/ISimplePickList";
import {IOrder} from "../../interfaces/IOrder";
import {ProductsCartComponent} from "../../components/products-cart/products-cart.component";
import {ProductsOrderComponent} from "../../components/products-order/products-order.component";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {LABEL} from "../../constants/label.constant";

class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src?: string, public file?: File) {
  }
}

@Component({
  selector: 'app-crea-modifica-articolo-dialog',
  templateUrl: './crea-modifica-ordine-dialog.component.html',
  styleUrls: ['./crea-modifica-ordine-dialog.component.scss']
})
export class CreaModificaOrdineDialogComponent implements OnInit {
  @ViewChild('imageInput') imageInput: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  @ViewChild('productsOrderComponent') productsOrderComponent!: ProductsOrderComponent;
  @ViewChild('inputCustomer') inputCustomer: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('autocomplete') autocomplete!: MatAutocomplete;


  myControl = new FormControl<null | ICustomer>(null, Validators.required);

  alertOK = false;
  alertKO = false;
  alertUpdateOK = false;
  alertUpdateKO = false;
  alertChangeFormatPrice = false;
  isSmall = false;

  utility = UTILITY;
  title = 'Nuovo Ordine';
  orderForm!: FormGroup;
  order!: IOrder;
  public refreshList = new EventEmitter();
  colori: IColor[] = [];
  @ViewChild('coloreInput') coloreInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  tagliaAbbigliamento: ISimplePickList[] = [];
  tagliaAbbigliamentoEu: ISimplePickList[] = [];
  tagliaScarpe: ISimplePickList[] = [];
  @ViewChild('tagliaInput') tagliaInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  fornitori: IProvider[] = [];
  customers: ICustomer[] = [];
  filteredOptionsCustomers: Observable<ICustomer[]> | undefined;
  orderTypes: ISimplePickList[] = [];
  paymentMethods: ISimplePickList[] = [];
  deliveries: ISimplePickList[] = [];
  seasonTypes: ISimplePickList[] = [];
  tipologiaProdotti: IProductType[] = [];

  selectedFile: ImageSnippet = new ImageSnippet();

  validationOrder = {
    customer: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'pattern', message: 'Formato inserito non valido.'}
    ],
    orderType: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    paymentMethod: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    delivery: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ],
    seasonType: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private productService: ProductService,
              private authService: AuthService, private commonService: CommonService, private providerService: ProviderService,
              private orderService: OrderService, private customerService: CustomerService, public dialog: MatDialog,
              private cdkRef: ChangeDetectorRef, public dialogRef: MatDialogRef<CreaModificaOrdineDialogComponent>) {
    this.dialogRef.disableClose = true;

    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });

    this.commonService.colori.subscribe((colors: IColor[]) => {
      this.colori = colors as IColor[];
    });

    this.commonService.clothingSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaAbbigliamento = sizes as ISimplePickList[];
    });

    this.commonService.clothingNumberSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaAbbigliamentoEu = sizes as ISimplePickList[];
    });

    this.commonService.shoeSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaScarpe = sizes as ISimplePickList[];
    });

    this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });

    this.customerService.customers.subscribe((customers: ICustomer[]) => {
      this.customers = customers as ICustomer[];
    })

    this.commonService.orderTypeList.subscribe(orderTypeList => {
      this.orderTypes = orderTypeList;
    });

    this.commonService.paymentMethodsList.subscribe(paymentMethodsList => {
      this.paymentMethods = paymentMethodsList;
    });

    this.commonService.deliveryList.subscribe(deliveryList => {
      this.deliveries = deliveryList;
    });

    this.commonService.seasonTypeList.subscribe(seasonTypeList => {
      this.seasonTypes = seasonTypeList;
    });

    this.createForm(data);
    this.onChanges();
  }

  ngOnInit() {
    this.filteredOptionsCustomers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.ragioneSociale;
        return name ? this._filter(name as string) : this.customers.slice();
      }),
    );
  }

  displayFn(customer: ICustomer): string {
    return customer && customer.ragioneSociale ? customer.ragioneSociale : '';
  }

  private _filter(ragioneSociale: string): ICustomer[] {
    const filterValue = ragioneSociale.toLowerCase();

    return this.customers.filter(customer => customer.ragioneSociale.toLowerCase().includes(filterValue));
  }


  createForm(data: any) {
    const newOrder: IOrder = {
      id: null,
      cliente: null,
      productList: [],
      idUser: this.authService.userProfile.getValue()?.id,
      descUser: this.authService.userProfile.getValue()?.username,
      idCustomer: null,
      idOrderType: null,
      idPaymentMethods: null,
      idSeason: null,
      idDelivery: null,
      totalPieces: 0,
      totalAmount: 0,
      status: LABEL.PENDING
    };

    let customer = null;
    let orderType = null;
    let paymentMethod = null;
    let delivery = null;
    let seasonType = null;
    if (UTILITY.checkObj(data) && UTILITY.checkObj(data.order)) {
      this.order = data.order;
      this.title = UTILITY.checkObj(data.order.id) ? 'Modifica Ordine' : 'Nuovo Ordine';
      customer = this.customers.find(c => c.id === this.order.idCustomer);
      orderType = this.orderTypes.find(o => o.id === this.order.idOrderType);
      paymentMethod = this.paymentMethods.find(p => p.id === this.order.idPaymentMethods);
      delivery = this.deliveries.find(d => d.id === this.order.idDelivery);
      seasonType = this.seasonTypes.find(s => s.id === this.order.idSeason);
      setTimeout(() => {
        if(this.autocomplete) {
          this.autocomplete.showPanel = false;
        }
        const inputElement = this.inputCustomer.nativeElement;
        if (inputElement) {
          inputElement.blur();
        }
      },300);
    } else {
      this.order = newOrder;
    }
    this.orderForm = this.fb.group({
      customer: new UntypedFormControl(customer, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      orderType: new UntypedFormControl(orderType, Validators.compose([
        Validators.required
      ])),
      paymentMethod: new UntypedFormControl(paymentMethod, Validators.compose([
        Validators.required
      ])),
      delivery: new UntypedFormControl(delivery, Validators.compose([
        Validators.required
      ])),
      seasonType: new UntypedFormControl(seasonType, Validators.compose([
        Validators.required
      ]))
    });

    this.myControl.setValue(customer ? customer : null);

  }

  onChanges() {
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  /*** SALVATAGGIO ***/
  save() {
    if (this.myControl.value && this.myControl.value!.id) {
      console.log('Value: ', this.myControl?.value)
      const totalPieces = this.getTotalPieces(this.order.productList);
      const totalAmount = this.getTotalAmount(this.order.productList);
      const order: IOrder = {
        id: UTILITY.checkText(this.order!.id) ? this.order!.id : null,
        idCustomer: this.myControl.value.id,
        descCustomer: this.myControl.value?.ragioneSociale,
        idUser: this.authService.userProfile.getValue()?.id,
        descUser: this.authService.userProfile.getValue()?.name,
        idOrderType: this.orderForm.get('orderType')?.value.id,
        descOrderType: this.orderForm.get('orderType')?.value.desc,
        idPaymentMethods: this.orderForm.get('paymentMethod')?.value.id,
        descPaymentMethods: this.orderForm.get('paymentMethod')?.value.desc,
        idDelivery: this.orderForm.get('delivery')?.value.id,
        descDelivery: this.orderForm.get('delivery')?.value.desc,
        idSeason: this.orderForm.get('seasonType')?.value.id,
        descSeason: this.orderForm.get('seasonType')?.value.desc,
        totalPieces: totalPieces,
        totalAmount: totalAmount,
        status: LABEL.PENDING,
        productList: this.order.productList
      };
      this.orderService.createOrUpdateOrder(order).subscribe({
        next: value => {
          if(order.id) {
            this.alertUpdateOK = true;
          } else {
            this.alertOK = true;
          }
          // this.order = order;
          this.order = value.id;
        },
        error: err => {
          if(order.id) {
            this.alertUpdateKO = true;
          } else {
            this.alertKO = true;
          }
          console.log('Result: ', err)
        }
      });
    } else {
      this.myControl.setErrors({'incorrect': true});
    }
    this.scrollToBottom();
  }

  getTotalPieces(productList: IProduct[]): number {
    let total = 0;
    productList.forEach(product => {
      product.colorVariants?.forEach(colorVariant => {
        if (colorVariant.stockOrder)
          total = total + colorVariant.stockOrder;

        colorVariant.sizeVariants?.forEach(sizeVariant => {
          if (sizeVariant.stockOrder)
            total = total + sizeVariant.stockOrder;
        });
      });
    });
    return total;
  }

  getTotalAmount(productList: IProduct[]): number {
    let total = 0;
    productList.forEach(product => {
      product.colorVariants?.forEach(colorVariant => {
        if (colorVariant.stockOrder && product.price)
          total = total + product.price * colorVariant.stockOrder;

        colorVariant.sizeVariants?.forEach(sizeVariant => {
          if (sizeVariant.stockOrder && product.price)
            total = total + product.price * sizeVariant.stockOrder;
        });
      });
    });
    return total;
  }

  /*** ALERT ***/
  closeAlert() {
    this.alertChangeFormatPrice = false;
    this.alertOK = false;
    this.alertKO = false;
    this.alertUpdateOK = false;
    this.alertUpdateKO = false;
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContentDialog.nativeElement.scrollTop = this.scrollContentDialog.nativeElement.scrollHeight;

      }, 100)
    } catch (err) {
      console.log(err);
    }
  }


  openDialogAddProduct() {
    const dialogRef = this.dialog.open(ProductsCartComponent, {
      height: '90%',
      width: '90%',
      data: this.order.productList
    });
    dialogRef.afterClosed().subscribe(result => {
      this.order.productList = dialogRef.componentInstance.orderProductList;
      this.productsOrderComponent.refreshList(this.order.productList);
      this.cdkRef.detectChanges();
      console.log('The dialog was closed');
    });
    /*

    dialogRef.componentInstance.refreshList.subscribe(() => {
      this.refreshList();
    });

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.componentInstance.refreshList.unsubscribe();
      console.log('The dialog was closed');
    });
     */
  }

  reloadList(orderProductList: IProduct[]) {
    setTimeout(() => {
      this.order.productList = orderProductList;
    });
  }
}
