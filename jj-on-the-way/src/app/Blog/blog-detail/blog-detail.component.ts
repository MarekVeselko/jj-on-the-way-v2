import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Article } from '../../shared/models/article.model';
import { ArticlesService } from '../../shared/services/articles.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Location } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) {
      this.translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
        this.router.navigate(['../../'], {relativeTo: route});
    });
  }

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
      data: { img: image },
      height: '90%',
      width: '90%'
    });
  }



}
