import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { EditOutfit } from './edit-outfit';

describe('EditOutfit', () => {
  let component: EditOutfit;
  let fixture: ComponentFixture<EditOutfit>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
  imports: [EditOutfit],

  providers: [
    provideRouter([]),
  ],
}).compileComponents();

    fixture = TestBed.createComponent(EditOutfit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
