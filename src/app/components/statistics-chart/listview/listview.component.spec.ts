import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartListViewComponent } from './charts.listview.component';

describe('ChartListViewComponent', () => {
  let component: ChartListViewComponent;
  let fixture: ComponentFixture<ChartListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
