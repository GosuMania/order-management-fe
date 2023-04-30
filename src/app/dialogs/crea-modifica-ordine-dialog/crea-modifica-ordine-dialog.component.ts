import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  FormArray,
  FormControl, FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {IColorVariant, IProduct, ISizeVariant} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColor} from "../../interfaces/IColor";
import {MatChipInputEvent} from "@angular/material/chips";
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
import {IUser} from "../../interfaces/IUser";
import {ProductsCartComponent} from "../../components/products-cart/products-cart.component";
import {ProductsOrderComponent} from "../../components/products-order/products-order.component";

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

  myControl = new FormControl<string | ICustomer>('');

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
  coloriSelected: IColor[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  coloriCtrl = new FormControl();
  filterColori: Observable<IColor[]> | undefined;
  @ViewChild('coloreInput') coloreInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  tagliaAbbigliamento: ISimplePickList[] = [];
  tagliaScarpe: ISimplePickList[] = [];
  taglie: ISimplePickList[] = [];
  taglieSelected: ISimplePickList[] = [];
  taglieCtrl = new FormControl();
  filterTaglie: Observable<ISimplePickList[]> | undefined;
  @ViewChild('tagliaInput') tagliaInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  fornitori: IProvider[] = [];
  customers: ICustomer[] = [];
  filteredOptionsCustomers: Observable<ICustomer[]> | undefined;
  orderTypes: ISimplePickList[] = [];
  paymentMethods: ISimplePickList[] = [];
  deliveries: ISimplePickList[] = [];
  seasonTypes: ISimplePickList[] = [];
  tipologiaProdotti: IProductType[] = [];
  sizeColumns: string[] = [];

  selectedFileOnChange: any;

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
              private cdkRef: ChangeDetectorRef) {

    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });

    this.commonService.colori.subscribe((colors: IColor[]) => {
      this.colori = colors as IColor[];
    });

    this.commonService.clothingSizes.subscribe((sizes: ISimplePickList[]) => {
      this.tagliaAbbigliamento = sizes as ISimplePickList[];
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

    this.customerService.getCustomerList().subscribe((customers: ICustomer[]) => {
      this.customers = customers;
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
      totalAmount:  0,
    };

    if (UTILITY.checkObj(data) && UTILITY.checkObj(data.order) && UTILITY.checkText(data.order.id)) {
      this.order = data.order;
      this.title = 'Modifica Ordine';
    } else {
      this.order = newOrder;
    }
    this.orderForm = this.fb.group({
      customer: new UntypedFormControl(this.order.idCustomer, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      orderType: new UntypedFormControl(this.order.idOrderType, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      paymentMethod: new UntypedFormControl(this.order.idPaymentMethods, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      delivery: new UntypedFormControl(this.order.idDelivery, Validators.compose([
        Validators.required,
      ])),
      seasonType: new UntypedFormControl(this.order.idSeason, Validators.compose([
        Validators.required,
      ])),
      colorVariants: this.fb.array([]),
    });

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
    /*
    const product: IProduct = {
      id: UTILITY.checkText(this.order!.id) ? this.order!.id : null,
      image: this.order.image,
      idProductType: this.orderForm.get('tipologiaProdotto')?.value.id,
      descProductType: this.orderForm.get('tipologiaProdotto')?.value.desc,
      idProvider: this.orderForm.get('fornitore')?.value.id,
      descProvider: this.orderForm.get('fornitore')?.value.ragioneSociale,
      productCode: this.orderForm.get('codiceArticolo')?.value,
      productDesc: this.orderForm.get('descrizioneArticolo')?.value,
      colorVariants: colorVariants,
      price: this.orderForm.get('prezzo')?.value,
    };
    this.productService.createOrUpdateProduct(product).subscribe(res => {
      console.log('Risultato', res);
      if (UTILITY.checkText(this.order!.id)) {
        this.alertUpdateOK = true;
      } else {
        this.alertOK = true;
        this.order.id = res.id;
      }
      this.alertChangeFormatPrice = false;
      this.scrollToBottom();
      this.refreshList.emit();
    }, error => {
      if (UTILITY.checkText(this.order!.id)) {
        this.alertUpdateKO = true;
      } else {
        this.alertKO = true;
      }
      this.alertChangeFormatPrice = false;
      this.scrollToBottom();
      console.log('# error salvataggio: ', error);
    })

     */
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
      this.productsOrderComponent.refreshList();
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
}
