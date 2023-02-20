import {IColore} from "./IColore";

export interface IProduct {
  id?: number | null;
  immagine: string;
  fornitore: string;
  // marchio: string;
  codiceArticolo: string;
  descrizioneArticolo: string;
  taglia: string;
  idColore: number;
  colore?: IColore;
  prezzo: number;
  quantitaMagazzino: number;
  quantitaDisponibile?: number;
}
