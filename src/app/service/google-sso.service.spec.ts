import { TestBed } from '@angular/core/testing';

import { GoogleSSOService } from './google-sso.service';

describe('GoogleSSOService', () => {
  let service: GoogleSSOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleSSOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
