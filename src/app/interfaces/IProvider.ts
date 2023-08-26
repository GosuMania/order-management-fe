import {ICustomer, IDestinazioneMerce, IMeta} from "./ICustomer";

export interface IProvider {
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
  date?: string;
}

export interface IProviderPagination {
  meta: IMeta,
  data: IProvider[]
}
