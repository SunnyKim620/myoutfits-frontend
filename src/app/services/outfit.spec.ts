import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { OutfitService } from './outfit';

describe('OutfitService', () => {
  let service: OutfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(OutfitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});