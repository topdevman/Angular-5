import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterdialogComponent } from './filterdialog.component';

describe('FilterdialogComponent', () => {
  let component: FilterdialogComponent;
  let fixture: ComponentFixture<FilterdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
