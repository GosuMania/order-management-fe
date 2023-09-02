import {Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {UTILITY} from "../../constants/utility.constant";
import {IColor} from "../../interfaces/IColor";
import {ColorService} from "../../services/color.service";

@Component({
  selector: 'app-crea-modifica-color-dialog',
  templateUrl: './crea-modifica-color-dialog.component.html',
  styleUrls: ['./crea-modifica-color-dialog.component.scss']
})
export class CreaModificaColorDialogComponent implements OnInit {
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  title = 'Nuovo Colore';
  colorForm: UntypedFormGroup;
  color: IColor;
  refreshList = new EventEmitter();

  alertOK = false;
  alertKO = false;
  alertUpdateOK = false;
  alertUpdateKO = false;

  validationColor = {
    color: [
      {type: 'required', message: 'Campo obbligatorio mancante.'},
      {type: 'minlength', message: 'Deve contenere almeno 2 caratteri.'},
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder, private colorService: ColorService,
              public dialogRef: MatDialogRef<CreaModificaColorDialogComponent>) {
    this.dialogRef.disableClose = true;

    const newColore: IColor = {
      id: null,
      colore: '',
    };
    this.color = UTILITY.checkObj(data) && UTILITY.checkObj(data.color) && UTILITY.checkText(data.color.id) ? data.color : newColore;
    this.title = UTILITY.checkText(this.color.id) ? 'Modifica Colore' : 'Nuovo Colore';

    this.colorForm = this.fb.group({
      color: new UntypedFormControl(this.color.colore, Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ]))
    });
  }

  ngOnInit() {
  }


  save() {
    this.closeAlert();

    const color: IColor = {
      id: UTILITY.checkText(this.color!.id) ? this.color!.id : null,
      colore: this.colorForm.get('color')?.value
    };
    this.colorService.createOrUpdateColor(color).subscribe({
      next: (res) => {
        console.log('Risultato', res);
        if (UTILITY.checkText(this.color!.id)) {
          this.alertUpdateOK = true;
        } else {
          this.alertOK = true;
          this.color.id = res.id;
        }
        this.scrollToBottom();
        this.refreshList.emit();
      }, error: (error) => {
        if (UTILITY.checkText(this.color!.id)) {
          this.alertUpdateKO = true;
        } else {
          this.alertKO = true;
        }
        this.scrollToBottom();
        console.log('# error salvataggio: ', error);
      }
    })
  }

  /*** ALERT ***/
  closeAlert() {
    this.alertOK = false;
    this.alertKO = false;
    this.alertUpdateOK = false;
    this.alertUpdateKO = false;
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContentDialog.nativeElement.scrollTop = this.scrollContentDialog.nativeElement.scrollHeight;

      }, 100)
    } catch (err) {
      console.log(err);
    }
  }

}
