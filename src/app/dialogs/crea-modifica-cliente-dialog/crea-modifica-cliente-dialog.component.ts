import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-crea-modifica-cliente-dialog',
  templateUrl: './crea-modifica-cliente-dialog.component.html',
  styleUrls: ['./crea-modifica-cliente-dialog.component.scss']
})
export class CreaModificaClienteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }


}
