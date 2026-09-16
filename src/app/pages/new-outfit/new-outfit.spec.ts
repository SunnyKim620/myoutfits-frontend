import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewOutfit } from './new-outfit';

describe('NewOutfit', () => {
  let component: NewOutfit;
  let fixture: ComponentFixture<NewOutfit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOutfit],
    }).compileComponents();

    fixture = TestBed.createComponent(NewOutfit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
