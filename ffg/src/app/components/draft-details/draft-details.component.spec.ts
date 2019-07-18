import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftDetailsComponent } from './draft-details.component';

describe('DraftDetailsComponent', () => {
  let component: DraftDetailsComponent;
  let fixture: ComponentFixture<DraftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
