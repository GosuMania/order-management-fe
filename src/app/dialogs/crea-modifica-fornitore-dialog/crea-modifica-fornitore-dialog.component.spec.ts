import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaFornitoreDialogComponent } from './crea-modifica-fornitore-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaFornitoreDialogComponent;
  let fixture: ComponentFixture<CreaModificaFornitoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaFornitoreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaFornitoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
