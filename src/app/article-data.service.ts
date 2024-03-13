import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleDataService {
  constructor(private http: HttpClient) {}

  getArticles(): Observable<any> {
    return this.http.get('https://midaiganes.irw.ee/api/list/972d2b8a');
  }
}
