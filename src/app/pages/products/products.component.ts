import {Component, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {IUtente} from "../../interfaces/IUtente";
import {MatTableDataSource} from "@angular/material/table";
import {ICustomer} from "../../interfaces/ICustomer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
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
import {IProduct} from "../../interfaces/IProduct";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  campaignOne: UntypedFormGroup;
  startDate: any;
  endDate: any;
  cercaValue: string = '';

  agenti: IUtente[] = [];

  displayedColumns: string[] = [
    'immagine',
    'codiceArticolo',
    'descrizioneArticolo',
    'taglia',
    'colore',
    'quantita'
  ];
  dataSource = new MatTableDataSource<IProduct>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private productService: ProductService, public commonService: CommonService,
              private authService: AuthService) {
    this.agenti = [];
    this.commonService.utenti.subscribe((utenti: IUtente[]) => {
      if (utenti.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = utenti as IUtente[];
        this.refreshList();
      }
    });
    // this.dataSource = new MatTableDataSource<ICliente>(ELEMENT_DATA);
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

  openDialogAddClient(product?: IProduct) {
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
    this.productService.getProductWithPaginationList().subscribe((products: IProduct[]) => {
      /*
       products.forEach(product => {
         product.usernameAgenteRiferimento = this.nomeAgente(product!.idAgenteRiferimento!);
       });
       */
      this.dataSource = new MatTableDataSource<IProduct>(products);

    });
  }

  nomeAgente(id: number): string {
    const agente = this.agenti.find(x => x.id === id);
    if (UTILITY.checkObj(agente)) {
      return agente!.username;
    }
    return '';
  }
}
