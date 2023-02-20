import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ICustomer, ICustomerPagination, IDestinazioneMerce} from "../../interfaces/ICustomer";
import {MatSort} from "@angular/material/sort";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {
  CreaModificaClienteDialogComponent
} from "../../dialogs/crea-modifica-cliente-dialog/crea-modifica-cliente-dialog.component";
import {CustomerService} from "../../services/customer.service";
import {CommonService} from "../../services/common.service";
import {IUtente} from "../../interfaces/IUtente";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements AfterViewInit {

  campaignOne: UntypedFormGroup;
  startDate: any;
  endDate: any;
  cercaValue: string = '';

  agenti: IUtente[] = [];

  displayedColumns: string[] = [
    // 'logo',
    'ragioneSociale',
    // 'indirizzo',
    // 'localita',
    // 'cap',
    'provincia',
    // 'paese',
    // 'piva',
    // 'codiceFiscale',
    // 'codiceSdi',
    // 'destionazioneMerce',
    'agenteRiferimento',
    'telefono',
    'email',
    'actions'
  ];
  dataSource = new MatTableDataSource<ICustomer>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private customerService: CustomerService, public commonService: CommonService,
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
    if(value === '') {
      this.cercaValue = '';
    }
    let filterValue = value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // TODO: far ripartire la chiamata
    this.dataSource.filter = filterValue;
  }

  openDialogAddClient(cliente?: ICustomer) {
    const dialogRef = this.dialog.open(CreaModificaClienteDialogComponent, {
      height: '90%',
      width: '90%',
      data: {cliente: cliente},
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
    this.customerService.getCustomerWithPaginationList().subscribe((data: ICustomerPagination) => {
      data.customers.forEach(customer => {
        customer.usernameAgenteRiferimento = this.nomeAgente(customer!.idAgenteRiferimento!);
      });
      this.dataSource = new MatTableDataSource<ICustomer>(data.customers);

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



