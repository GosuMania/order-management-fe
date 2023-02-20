import {IUtente} from "./IUtente";
import {ICustomer} from "./ICustomer";
import {IProduct} from "./IProduct";
import {IStagione} from "./IStagione";

export interface IOrdine {
  utente: IUtente;
  cliente: ICustomer;
  listaArticoli: IProduct[];
  modalitaPagamento: string;
  numeroOrdine: number;
  dataCosegna: string;
  stagione: IStagione;
}
