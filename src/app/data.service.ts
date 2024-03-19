import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: any;
  paragraphs: string[] = [];
  tags: string[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // getIdFromRouter(): void {
  //   if (this.route.firstChild) {
  //     this.route.firstChild.params.subscribe((params) => {
  //       const id = params['id'];
  //       const articleId = id;
  //       this.fetchPosts(articleId);
  //       console.log(articleId);
  //     });
  //   } else {
  //     const defaultId = '972d2b8a';
  //     this.fetchPosts(defaultId);
  //   }
  // }

  getData(): void {
    this.isLoading = true;
    this.http
      .get('https://midaiganes.irw.ee/api/list?limit=500')
      .subscribe((response: any) => {
        console.log(response);
        this.data = response.list.map((item: any) => {
          if (item.personal_code) {
            item.personal_code = this.convertBirthday(item.personal_code);
          }
          return item;
        });
        this.isLoading = false;
      });
  }

  convertBirthday(psCode: number): string {
    const psStr: String = psCode.toString();
    const firstDigit: string = psStr.charAt(0);
    const birthdayDigits: string = psStr.substring(1, 7);
    let convertedBday: string = '';

    if (firstDigit === '3' || firstDigit === '4') {
      convertedBday = '19' + birthdayDigits;
    } else if (firstDigit === '5' || firstDigit === '6') {
      convertedBday = '20' + birthdayDigits;
    }

    return convertedBday;
  }

  fetchPosts(articleId: string): void {
    this.isLoading = true;
    this.http
      .get(`https://midaiganes.irw.ee/api/list/${articleId}`)
      .subscribe((response: any) => {
        // console.log(response);
        this.data = response;
        this.parseParagraphs(response.body);
        this.data = this.removePTags(response);
        this.tags = this.data.tags;
        this.isLoading = false;
      });
  }

  parseParagraphs(body: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    paragraphs.forEach((paragraph) => {
      this.paragraphs.push(paragraph.innerHTML);
    });
  }

  removePTags(data: any): any {
    if (data && data.intro) {
      data.intro = data.intro.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
    }
    return data;
  }
}
