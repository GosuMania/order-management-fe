import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ICliente} from "../../interfaces/ICliente";
import {MatSort} from "@angular/material/sort";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {
  CreaModificaClienteDialogComponent
} from "../../dialogs/crea-modifica-cliente-dialog/crea-modifica-cliente-dialog.component";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements AfterViewInit {

  campaignOne: UntypedFormGroup;
  startDate: any;
  endDate: any;

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
  dataSource = new MatTableDataSource<ICliente>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<ICliente>(ELEMENT_DATA);
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

  applyFilter(target: any) {
    let filterValue = target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    // TODO: far ripartire la chiamata
    this.dataSource.filter = filterValue;
  }

  openDialogAddClient(cliente?: ICliente) {
    const dialogRef = this.dialog.open(CreaModificaClienteDialogComponent, {
      data: {cliente: cliente},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

const ELEMENT_DATA: ICliente[] = [
  {
    id: 1,
    ragioneSociale: 'AAAAA',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'Veronica',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 2,
    ragioneSociale: 'BBBBBBB',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'Luigi',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 3,
    ragioneSociale: 'CCCC',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 4,
    ragioneSociale: 'DDDDD',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 5,
    ragioneSociale: 'EEEEE',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 6,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 7,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 8,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 9,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 10,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 11,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 12,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 13,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 14,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 15,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 16,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 17,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 18,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 19,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
  {
    id: 20,
    ragioneSociale: 'Hydrogen',
    piva: 'string',
    codiceFiscale: 'string',
    codiceSdi: 'string',
    pec: 'string',
    indirizzo: 'string',
    cap: 'string',
    localita: 'string',
    provincia: 'string',
    paese: 'IT',
    telefono: 'string',
    email: 'string',
    destionazioneMerce: 'string',
    agenteRiferimento: 'string',
    logo: 'https://play-lh.googleusercontent.com/TdcvdWjFnm7oCXlpL9EZNpv-PYcs7v_ny87qncJ1tIWoZbQKzIvPFFAdoeyEpF2O2Kc'
  },
];

