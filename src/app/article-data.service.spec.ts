import { TestBed } from '@angular/core/testing';

import { ArticleDataService } from './article-data.service';

describe('ArticleDataService', () => {
  let service: ArticleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
