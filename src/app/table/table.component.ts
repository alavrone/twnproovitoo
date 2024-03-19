import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class TableComponent implements OnInit {
  data: any;
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  sortDirection: any = {};
  originalData: any[] = [];
  toggledRows: Set<any> = new Set();

  columns = [
    { key: 'firstname', title: 'Eesnimi' },
    { key: 'surname', title: 'Perekonnanimi' },
    { key: 'sex', title: 'Sugu' },
    { key: 'personal_code', title: 'Sünnikuupäev' },
    { key: 'phone', title: 'Telefon' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.dataService.getDataAPI().subscribe((response: any) => {
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

  // getData(): void {
  //   this.isLoading = true;
  //   this.http
  //     .get('https://midaiganes.irw.ee/api/list?limit=500')
  //     .subscribe((response: any) => {
  //       console.log(response);
  //       this.data = response.list.map((item: any) => {
  //         if (item.personal_code) {
  //           item.personal_code = this.convertBirthday(item.personal_code);
  //         }
  //         return item;
  //       });
  //       this.isLoading = false;
  //     });
  // }

  toggleRow(item: any) {
    if (this.toggledRows.has(item)) {
      this.toggledRows.delete(item);
    } else {
      this.toggledRows.clear();
      this.toggledRows.add(item);
    }
  }

  isRowToggled(item: any): boolean {
    return this.toggledRows.has(item);
  }

  sortData(sortColumn: string): void {
    Object.keys(this.sortDirection).forEach((column) => {
      if (column !== sortColumn) {
        this.sortDirection[column] = null;
      }
    });

    if (this.originalData.length === 0 && !this.sortDirection[sortColumn]) {
      this.originalData = [...this.data];
      // this.sortDirection[sortColumn] = 'def';
      this.data.sort((a: any, b: any) => {
        return a[sortColumn] > b[sortColumn]
          ? 1
          : a[sortColumn] < b[sortColumn]
          ? -1
          : 0;
      });
      this.sortDirection[sortColumn] = 'asc';
    } else if (this.sortDirection[sortColumn] === 'asc') {
      this.data.sort((a: any, b: any) => {
        return a[sortColumn] < b[sortColumn]
          ? 1
          : a[sortColumn] > b[sortColumn]
          ? -1
          : 0;
      });
      this.sortDirection[sortColumn] = 'desc';
    } else {
      this.data = [...this.originalData];
      this.sortDirection[sortColumn] = null;
      this.originalData = [];
    }
  }

  changeSortColumn(order: string): void {
    if (order !== 'phone') {
      this.sortData(order);
    }
  }

  getColumnSortState(column: string): string {
    return this.sortDirection[column] || 'def';
  }

  changeSex(sex: string): string {
    switch (sex) {
      case 'f':
        return 'Naine';
      case 'm':
        return 'Mees';
      default:
        return sex;
    }
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

  reverseDates(birthday: string): string {
    const year: string = birthday.substring(0, 4);
    const month: string = birthday.substring(4, 6);
    const day: string = birthday.substring(6, 8);
    const reversedBirthday: string = day + '.' + month + '.' + year;

    return reversedBirthday;
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  paginateData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  getPageRange(): number[] {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    const visiblePages = 5;

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(visiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  parseParagraphs(body: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    const result: string[] = [];
    paragraphs.forEach((paragraph) => {
      result.push(paragraph.innerHTML);
    });
    return result;
  }
}
