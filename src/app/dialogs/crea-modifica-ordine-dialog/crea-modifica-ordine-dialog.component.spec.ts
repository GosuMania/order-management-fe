import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaOrdineDialogComponent } from './crea-modifica-ordine-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaOrdineDialogComponent;
  let fixture: ComponentFixture<CreaModificaOrdineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaOrdineDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaOrdineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
