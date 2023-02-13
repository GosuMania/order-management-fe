export interface ICliente {
  id?: number;
  logo?: string;
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
  idAgenteRiferimento: number;
}

export interface IDestinazioneMerce {
  indirizzo: string;
  cap: string;
  localita: string;
  provincia: string;
  paese: string;
}
