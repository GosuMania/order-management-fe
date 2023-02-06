import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseExchangeComponent } from './merchandise-exchange.component';

describe('MerchandiseExchangeComponent', () => {
  let component: MerchandiseExchangeComponent;
  let fixture: ComponentFixture<MerchandiseExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchandiseExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
