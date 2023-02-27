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
  meta: IMeta,
  data: ICustomer[]
}

export interface IMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
