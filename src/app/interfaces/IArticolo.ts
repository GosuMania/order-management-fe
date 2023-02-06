import {IColore} from "./IColore";

export interface IArticolo {
  id?: number;
  marchio: string;
  descrizioneArticolo: string;
  codiceArticolo: string;
  prezzo: number;
  taglia: string;
  colore: IColore;
}
