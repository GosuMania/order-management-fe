import {AfterViewInit, Component, Provider, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {
  CreaModificaClienteDialogComponent
} from "../../dialogs/crea-modifica-cliente-dialog/crea-modifica-cliente-dialog.component";
import {CommonService} from "../../services/common.service";
import {IUser} from "../../interfaces/IUser";
import {AuthService} from "../../services/auth.service";
import {IProvider, IProviderPagination} from "../../interfaces/IProvider";
import {ProviderService} from "../../services/provider.service";
import {
  CreaModificaFornitoreDialogComponent
} from "../../dialogs/crea-modifica-fornitore-dialog/crea-modifica-fornitore-dialog.component";

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements AfterViewInit {

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

  agenti: IUser[] = [];

  displayedColumns: string[] = [
    // 'logo',
    'ragioneSociale',
    // 'indirizzo',
    // 'localita',
    // 'cap',
    'provincia',
    // 'paese',
    'piva',
    // 'codiceFiscale',
    // 'codiceSdi',
    // 'destionazioneMerce',
    // 'agenteRiferimento',
    'telefono',
    'email',
    'actions'
  ];
  dataSource = new MatTableDataSource<IProvider>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private providerService: ProviderService, public commonService: CommonService,
              private authService: AuthService) {
    this.agenti = [];
    this.commonService.utenti.subscribe((usersApi: IUser[]) => {
      if (usersApi.length === 0) {
        this.authService.getUsersList().subscribe(users => {
          this.commonService.utenti.next(users);
        })
      } else {
        this.agenti = usersApi as IUser[];
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
    if(UTILITY.checkText(filterValue)) {
      this.providerService.getProviderWithPaginationListSearch(filterValue, this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
        .subscribe((data: IProviderPagination) => {
          this.total = data.meta.total;
          this.lastPage = data.meta.last_page;
          this.dataSource = new MatTableDataSource<IProvider>(data.data);
        });
    } else {
      this.refreshList();
    }

    // this.dataSource.filter = filterValue;
  }

  openDialogAddFornitore(fornitore?: IProvider) {
    const dialogRef = this.dialog.open(CreaModificaFornitoreDialogComponent, {
      height: '90%',
      width: '90%',
      data: {fornitore: fornitore},
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
    this.providerService.getProviderWithPaginationList(this.orderBy, this.ascDesc, this.perPage, this.currentPage + 1)
      .subscribe((data: IProviderPagination) => {
        this.total = data.meta.total;
        this.lastPage = data.meta.last_page;
        this.dataSource = new MatTableDataSource<IProvider>(data.data);
      });
  }

  nomeAgente(id: number): string {
    const agente = this.agenti.find(x => x.id === id);
    if (UTILITY.checkObj(agente)) {
      return agente!.username;
    }
    return '';
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

  delete(id: number) {
    this.providerService.deleteProvider(id).subscribe(res => {
      this.refreshList();
    });
  }
}



