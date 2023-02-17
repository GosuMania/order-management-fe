import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IUtente} from "../interfaces/IUtente";

@Injectable({
  providedIn: 'root',
})
export class CommonService {


  public utenti: BehaviorSubject<IUtente[]> = new BehaviorSubject<IUtente[]>([]);

  constructor() {}

}

