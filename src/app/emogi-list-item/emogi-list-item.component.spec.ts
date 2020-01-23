import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmogiListItemComponent } from './emogi-list-item.component';

describe('EmogiListItemComponent', () => {
  let component: EmogiListItemComponent;
  let fixture: ComponentFixture<EmogiListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmogiListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmogiListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
