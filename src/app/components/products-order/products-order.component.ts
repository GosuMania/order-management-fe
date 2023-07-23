import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IUser} from "../../interfaces/IUser";
import {MatTableDataSource} from "@angular/material/table";
import {ICustomer, ICustomerPagination} from "../../interfaces/ICustomer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CustomerService} from "../../services/customer.service";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from "moment/moment";
import {
  CreaModificaClienteDialogComponent
} from "../../dialogs/crea-modifica-cliente-dialog/crea-modifica-cliente-dialog.component";
import {
  CreaModificaArticoloDialogComponent
} from "../../dialogs/crea-modifica-articolo-dialog/crea-modifica-articolo-dialog.component";
import {IColorVariant, IProduct, IProductPagination, ISizeVariant} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";
import {IColor} from "../../interfaces/IColor";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProviderService} from "../../services/provider.service";
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";
import {ProductsComponent} from "../../pages/products/products.component";
import {ProductsCartComponent} from "../products-cart/products-cart.component";
import {ISimplePickList} from "../../interfaces/ISimplePickList";

@Component({
  selector: 'app-products-order',
  templateUrl: './products-order.component.html',
  styleUrls: ['./products-order.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsOrderComponent implements AfterViewInit {

  @Input() orderProductList: IProduct[] = [];
  @Output() updateOrderProductList = new EventEmitter<any>();

  cercaValue: string = '';
  perPage = 5;
  lastPage = 0;
  orderBy = 'id';
  ascDesc = 'ASC';
  currentPage = 0;
  total = 0;
  isSmall = false;

  colori: IColor[] = [];
  taglie: ISimplePickList[] = [];
  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];


  displayedColumns: string[] = [
    'immagine',
    'descProvider',
    'descProductType',
    'codiceArticolo',
    'descrizioneArticolo',
    'prezzo',
    'actions'
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  displayedColumnsInExpand: string[] = [
    'colore',
    'tagliaDisponibilita',
    'totale'
  ];

  dataSource = new MatTableDataSource<IProduct>([]);
  expandedElement: IProduct[] | null | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private productService: ProductService, private commonService: CommonService,
              private providerService: ProviderService) {

    this.commonService.isSmall.subscribe(res => {
      this.isSmall = res;
    });

    this.commonService.colori.subscribe((colors: IColor[]) => {
      this.colori = colors as IColor[];
    });
    this.commonService.clothingSizes.subscribe((sizes: ISimplePickList[]) => {
      this.taglie = sizes as ISimplePickList[];
    });
    this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });

    // this.dataSource = new MatTableDataSource<IProduct>(ELEMENT_DATA);
    this.refreshList();

  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  delete(productInput: IProduct) {
    productInput.isAdded = false;
    productInput.colorVariants?.forEach(colorVariant => {
      colorVariant.stockOrder = 0;
      colorVariant.sizeVariants?.forEach(sizeVariant => {
        sizeVariant.stockOrder = 0;
      });
    });
    this.orderProductList = this.orderProductList.filter(product => product.id !== productInput.id);
    this.refreshList();
  }

  applyFilter(value: string) {
    if (value === '') {
      this.cercaValue = '';
    }
    let filterValue = value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (UTILITY.checkText(filterValue)) {
      this.productService.getProductWithPaginationListSearch(filterValue, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
        .subscribe((data: IProductPagination) => {
          /*
          if(data.data.length > 0) {
            data.data.forEach(product => product.colore = this.setProductColor(product.idColore));
          }
           */
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IProduct>(data.data);
        });
    } else {
      this.refreshList();
    }
    // this.dataSource.filter = filterValue;
  }

  openDialogAddProduct() {
    const dialogRef = this.dialog.open(ProductsCartComponent, {
      height: '90%',
      width: '90%',
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

  refreshList(list? : IProduct[]) {
    if(list) {
      this.orderProductList = list;
    }
    this.dataSource = new MatTableDataSource<IProduct>(this.orderProductList);

    this.updateOrderProductList.emit(this.orderProductList);
  }

  setProductColor(idColore: number): IColor | null {
    const colore = this.colori.find(x => x.id === idColore);
    return colore ? colore : null;
  }


  paginatorChange(event: any) {
    console.log('Event: ', event)
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.refreshList();
  }

  sortChange(event: Sort) {
    console.log('Stort: ', event);
    this.ascDesc = event.direction.toUpperCase();
    this.orderBy = UTILITY.camelcaseToSnakeCase(event.active);
    if (!UTILITY.checkText(this.ascDesc) || !UTILITY.checkText(this.orderBy)) {
      this.ascDesc = 'ASC';
      this.orderBy = 'id';
    }
    this.refreshList();
  }

  getTotalStocks(product: IProduct): number {
    let total = 0;
    if (product && product.colorVariants && (product.idProductType == 0 || product.idProductType == 2)) {
      product.colorVariants.forEach(element => {
        element.sizeVariants?.forEach(element2 => {
          total = element2.stock + total;
        });
      });
    } else if (product && product.colorVariants) {
      product.colorVariants.forEach(element => {
        if (element.stock) {
          total = element.stock + total;
        }
      });
    }
    return total;
  }

  getTotalStocksForColor(variants: ISizeVariant[]): number {
    let total = 0;
    variants.forEach(element => {
      total = element.stock + total;
    })
    return total;

  }
}
