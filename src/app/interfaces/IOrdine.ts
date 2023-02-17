import {IUtente} from "./IUtente";
import {ICustomer} from "./ICustomer";
import {IArticolo} from "./IArticolo";
import {IStagione} from "./IStagione";

export interface IOrdine {
  utente: IUtente;
  cliente: ICustomer;
  listaArticoli: IArticolo[];
  modalitaPagamento: string;
  numeroOrdine: number;
  dataCosegna: string;
  stagione: IStagione;
}
