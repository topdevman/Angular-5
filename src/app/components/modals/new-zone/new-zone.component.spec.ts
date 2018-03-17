import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewZoneComponent } from './new-zone.component';

describe('NewZoneComponent', () => {
  let component: NewZoneComponent;
  let fixture: ComponentFixture<NewZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
