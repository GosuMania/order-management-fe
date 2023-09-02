import {ChangeDetectorRef, Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren,} from '@angular/core';
import {IProduct} from "../../interfaces/IProduct";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UTILITY} from "../../constants/utility.constant";
import {VariantsProductOrderComponent} from "../../components/variants-product-order/variants-product-order.component";


@Component({
  selector: 'app-crea-modifica-variants-dialog',
  templateUrl: './crea-modifica-variants-dialog.component.html',
  styleUrls: ['./crea-modifica-variants-dialog.component.scss']
})
export class CreaModificaVariantsDialogComponent {
  product!: IProduct;
  checkValid = false;
  utility = UTILITY;
  @ViewChildren('variantsProductOrderComponent') variantsProductOrderComponent!: QueryList<VariantsProductOrderComponent>;
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdkRef: ChangeDetectorRef,
              public dialogRef: MatDialogRef<CreaModificaVariantsDialogComponent>) {
    this.dialogRef.disableClose = true;

    this.product = JSON.parse(JSON.stringify(data.product));
  }

  confirm(): void {
    let newProduct = this.product;
    let check = false;
    this.checkValid = false;
    this.variantsProductOrderComponent.forEach((productOrder) => {
      if (productOrder.product.id === newProduct.id) {
        check = productOrder.checkValidate(newProduct.idProductType);
        if(check) {
          newProduct.colorVariants = productOrder.getColorVariantsToSave(newProduct.idProductType);
        }
      }
    });
    if(check) {
      this.dialogRef.close(newProduct);
    } else {
      this.checkValid = true;
    }
  }
}
