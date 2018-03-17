import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChartDlgComponent } from './edit-chart-dlg.component';

describe('EditChartDlgComponent', () => {
  let component: EditChartDlgComponent;
  let fixture: ComponentFixture<EditChartDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChartDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChartDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
