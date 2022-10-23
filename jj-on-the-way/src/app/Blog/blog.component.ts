import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit, AfterViewInit {
  articles!: Observable<any>;
  dataSource = new MatTableDataSource<Article>();
  @ViewChild('paginator') paginator!: MatPaginator;
  paginatorIndex = 0;

  constructor(private articleService: ArticlesService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(searchedText?: string) {
    this.articleService.getArticles('PUBLISHED', searchedText).subscribe(response => {
      this.dataSource.data = response;
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


  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

}
