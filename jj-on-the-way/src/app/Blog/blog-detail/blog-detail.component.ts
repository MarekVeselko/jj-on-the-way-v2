import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { ArticlesService } from '../../shared/services/articles.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit {
  article!: Article;
  showGallery = false;

  constructor(private articleService: ArticlesService,
    private dialog: MatDialog,
    public location: Location,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.articleService.getArticle(this.route.snapshot.params['id']).subscribe(response => {
      this.article = response;
      this.showGallery = this.article.gallery.length > 0;
      this.cdr.markForCheck();
    })

  }

  getImageId(imageUrl: string) {
    return this.articleService.getImageId(imageUrl);
  }

  openModal(image: string) {
    this.dialog.open(ImageDialogComponent, {
      data: {img: image},
      height: '90%',
      width: '90%'
    });
  }



}
