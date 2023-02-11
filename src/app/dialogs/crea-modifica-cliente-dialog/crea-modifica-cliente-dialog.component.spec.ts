import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaClienteDialogComponent } from './crea-modifica-cliente-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaClienteDialogComponent;
  let fixture: ComponentFixture<CreaModificaClienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaClienteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaClienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
