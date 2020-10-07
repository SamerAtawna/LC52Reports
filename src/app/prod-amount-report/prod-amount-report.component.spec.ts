import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdAmountReportComponent } from './prod-amount-report.component';

describe('ProdAmountReportComponent', () => {
  let component: ProdAmountReportComponent;
  let fixture: ComponentFixture<ProdAmountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdAmountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdAmountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
