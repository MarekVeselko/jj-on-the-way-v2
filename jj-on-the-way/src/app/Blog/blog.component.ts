import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

interface Section {
  name: string,
  value: string
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit, AfterViewInit {
  articles!: Observable<any>;
  dataLength: number = 0;
  dataSource = new MatTableDataSource<Article>();
  sectionType: Section | null = null;
  @ViewChild('paginator') paginator!: MatPaginator;
  paginatorIndex = 0;
  sections: Section[];
  timeout: any = null;


  constructor(private articleService: ArticlesService,
    private cdr: ChangeDetectorRef) {
    this.sections = [
      { name: 'Všetky', value: 'all' },
      { name: 'Všeobecné', value: 'general' },
      { name: 'Európa', value: 'europe' },
      { name: 'Ázia', value: 'asia' },
      { name: 'Afrika', value: 'africa' },
      { name: 'Severná Amerika', value: 'northAmerica' },
      { name: 'Južná Amerika', value: 'southAmerica' },
    ]
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(searchedText?: string) {
    this.articleService.getArticles('PUBLISHED', this.sectionType?.value, searchedText).subscribe(response => {
      this.dataSource.data = response;
      this.dataLength = this.dataSource.data.length
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorIndex = this.paginator.pageIndex;
    this.articles = this.dataSource.connect();
    this.cdr.markForCheck();
  }

  getImageId(imageUrl: string) {
    return this.articleService.getImageId(imageUrl);
  }

  search(searchedText?: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      this.getItems(searchedText);
    }, 500);
  }


  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

}
