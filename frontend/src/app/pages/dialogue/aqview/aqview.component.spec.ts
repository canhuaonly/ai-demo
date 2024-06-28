import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqviewComponent } from './aqview.component';

describe('AqviewComponent', () => {
  let component: AqviewComponent;
  let fixture: ComponentFixture<AqviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AqviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AqviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
