import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IUtente} from "../../interfaces/IUtente";
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
import {IColore} from "../../interfaces/IColore";
import {ITaglia} from "../../interfaces/ITaglia";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ProviderService} from "../../services/provider.service";
import {IProvider} from "../../interfaces/IProvider";
import {IProductType} from "../../interfaces/IProductType";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsComponent implements AfterViewInit{

  campaignOne: UntypedFormGroup;
  startDate: any;
  endDate: any;
  cercaValue: string = '';
  perPage = 5;
  lastPage = 0;
  orderBy = 'id';
  ascDesc = 'ASC';
  currentPage = 0;
  total = 0;

  colori: IColore[] = [];
  taglie: ITaglia[] = [];
  fornitori: IProvider[] = [];
  tipologiaProdotti: IProductType[] = [];


  displayedColumns: string[] = [
    'immagine',
    'fornitore',
    'type',
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
    this.commonService.colori.subscribe((colors: IColore[]) => {
      this.colori = colors as IColore[];
    });
    this.commonService.taglieAbbigliamento.subscribe((sizes: ITaglia[]) => {
      this.taglie = sizes as ITaglia[];
    });
    this.commonService.fornitori.subscribe((providers: IProvider[]) => {
      this.fornitori = providers as IProvider[];
    });

    this.commonService.tipologiaProdotti.subscribe((productTypes: IProductType[]) => {
      this.tipologiaProdotti = productTypes as IProductType[];
    });

    this.dataSource = new MatTableDataSource<IProduct>(ELEMENT_DATA);


    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDate();
    this.campaignOne = new UntypedFormGroup({
      start: new UntypedFormControl(null),
      end: new UntypedFormControl(null),
    });

    if (UTILITY.checkObj(this.campaignOne)) {
      this.campaignOne.get('start')?.valueChanges.subscribe(value => {
        if (UTILITY.checkText(value) && this.startDate !== moment(value).format('YYYY-MM-DD')) {
          this.startDate = moment(value).format('YYYY-MM-DD');
        }
      });

      this.campaignOne.get('end')?.valueChanges.subscribe(value => {
        if (UTILITY.checkText(value) && this.endDate !== moment(value).format('YYYY-MM-DD')) {
          this.endDate = moment(value).format('YYYY-MM-DD');
          if (UTILITY.checkText(this.startDate) && UTILITY.checkText(this.endDate)) {
            console.log('Date:', this.startDate, ' - ', this.endDate)
            // TODO far ripartire la chiamata
          }
        }
      });
    }

  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(value: string) {
    if (value === '') {
      this.cercaValue = '';
    }
    let filterValue = value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // TODO: far ripartire la chiamata
    this.dataSource.filter = filterValue;
  }

  openDialogAddProduct(product?: IProduct) {
    const dialogRef = this.dialog.open(CreaModificaArticoloDialogComponent, {
      height: '90%',
      width: '90%',
      data: {product: product},
    });

    dialogRef.componentInstance.refreshList.subscribe(() => {
      this.refreshList();
    });

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.componentInstance.refreshList.unsubscribe();
      console.log('The dialog was closed');
    });
  }

  refreshList() {

    this.productService.getProductWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
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
  }

  setProductColor(idColore: number): IColore | null {
    const colore = this.colori.find(x => x.id === idColore);
    return  colore ? colore : null;
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
    if(!UTILITY.checkText(this.ascDesc) || !UTILITY.checkText(this.orderBy)) {
      this.ascDesc = 'ASC';
      this.orderBy = 'id';
    }
    this.refreshList();
  }

  getTotalStocks(variants : IColorVariant[]) : number {
    let total = 0;
    variants.forEach(element => {
      element.sizeVariant?.forEach(element2 => {
        total = element2.stock + total;
      })
    })
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


const ELEMENT_DATA: IProduct[] = [
  {
    id: 1,
    immagine: 'https://maxmoda.madeinapp.net/content/webservices/get_article_image.php?guid=966CAD453451D93492000000000000000000000000000000&h=100&t=20190705185104&w=100',
    idFornitore: 1,
    descFornitore: 'Fornitore 1',
    codiceArticolo: 'EFRM1311V322',
    descrizioneArticolo: 'LIAM GIUBBINO UOMO FREEDOMDAY LIAM',
    prezzo: 50.00,
    idType: 1,
    descType: 'abbigliamento',
    colorVariants: [
      {
        id: 1,
        descColor: 'bianco',
        sizeVariant: [
          {
            id: 1,
            descSize: 'xs',
            stock: 10
          },
          {
            id: 2,
            descSize: 's',
            stock: 0
          },
          {
            id: 3,
            descSize: 'm',
            stock: 0
          },
          {
            id: 4,
            descSize: 'l',
            stock: 0
          }
        ]
      },
      {
        id: 2,
        descColor: 'rosso',
        sizeVariant: [
          {
            id: 1,
            descSize: 'xs',
            stock: 10
          },
          {
            id: 2,
            descSize: 's',
            stock: 3
          },
          {
            id: 3,
            descSize: 'm',
            stock: 10
          },
          {
            id: 4,
            descSize: 'l',
            stock: 50
          }
        ]
      }
    ]
  },
  {
    id: 1,
    immagine: 'https://maxmoda.madeinapp.net/content/webservices/get_article_image.php?guid=966CAD453452D92418000000000000000000000000000000&h=100&t=20190705185104&w=100',
    idFornitore: 1,
    descFornitore: 'Fornitore 1',
    codiceArticolo: 'EFRM1312V208',
    descrizioneArticolo: 'FEDERICO GIUBBINO UOMO FREEDOMDAY FEDERICO F.L.',
    prezzo: 93.00,
    idType: 1,
    descType: 'abbigliamento',
    colorVariants: [
      {
        id: 1,
        descColor: 'bianco',
        sizeVariant: [
          {
            id: 1,
            descSize: 'xs',
            stock: 10
          },
          {
            id: 2,
            descSize: 's',
            stock: 0
          },
          {
            id: 3,
            descSize: 'm',
            stock: 0
          },
          {
            id: 4,
            descSize: 'l',
            stock: 0
          }
        ]
      },
      {
        id: 2,
        descColor: 'rosso',
        sizeVariant: [
          {
            id: 1,
            descSize: 'xs',
            stock: 10
          },
          {
            id: 2,
            descSize: 's',
            stock: 3
          },
          {
            id: 3,
            descSize: 'm',
            stock: 10
          },
          {
            id: 4,
            descSize: 'l',
            stock: 50
          }
        ]
      }
    ]
  }
]
