import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  getDataAPI(): Observable<any> {
    return this.http.get('https://midaiganes.irw.ee/api/list?limit=500');
  }

  fetchPosts(articleId: string): Observable<any> {
    return this.http.get(`https://midaiganes.irw.ee/api/list/${articleId}`);
  }
}
