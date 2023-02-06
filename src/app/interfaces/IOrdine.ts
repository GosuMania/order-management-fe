import {IUtente} from "./IUtente";
import {ICliente} from "./ICliente";
import {IArticolo} from "./IArticolo";
import {IStagione} from "./IStagione";

export interface IOrdine {
  utente: IUtente;
  cliente: ICliente;
  listaArticoli: IArticolo[];
  modalitaPagamento: string;
  numeroOrdine: number;
  dataCosegna: string;
  stagione: IStagione;
}
