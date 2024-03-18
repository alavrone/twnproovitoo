import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class ArticleComponent implements OnInit {
  data: any;
  paragraphs: string[] = [];
  tags: string[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getIdFromRouter();
  }

  getIdFromRouter(): void {
    if (this.route.firstChild) {
      this.route.firstChild.params.subscribe((params) => {
        const id = params['id'];
        const articleId = id;
        this.fetchPosts(articleId);
      });
    } else {
      const defaultId = '972d2b8a';
      this.fetchPosts(defaultId);
    }
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
