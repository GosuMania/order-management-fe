export interface ICustomer {
  id?: number | null;
  ragioneSociale: string;
  piva: string;
  codiceFiscale: string;
  codiceSdi: string;
  pec: string;
  indirizzo: string;
  cap: string;
  localita: string;
  provincia: string;
  paese: string;
  telefono: string;
  email: string;
  destinazioneMerce: IDestinazioneMerce;
  idAgenteRiferimento: number | null;
  usernameAgenteRiferimento: string | null;
}

export interface IDestinazioneMerce {
  indirizzo: string;
  cap: string;
  localita: string;
  provincia: string;
  paese: string;
}

export interface ICustomerPagination {
  currentPage: number,
  perPage: number,
  total: number,
  lastPage: number,
  customers: ICustomer[]
}
