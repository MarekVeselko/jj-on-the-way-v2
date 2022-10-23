import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { Article } from 'src/app/shared/models/article.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-new-article',
    templateUrl: './new-article.component.html',
    styleUrls: ['./new-article.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewArticleComponent {
    @ViewChild(ArticleFormComponent) formComponent!: ArticleFormComponent;
    constructor(public location: Location,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private articleService: ArticlesService,
        private userService: UserService) {
        if (!userService.isLoggedIn) {
            router.navigate(['./admin'])
        }

    }

    onSubmit(operationType: string) {
        const form = this.formComponent.onSubmit();
        if (!form) return;

        const dialogRef = this.dialog.open(ArticleDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.login({ pin: result.pin }).subscribe(response => {
                    if (response) {
                        const isPublished = operationType === 'SAVE' ? false : true;
                        const data = {
                            ...form.value,
                            dateCreated: new Date(),
                            isDeleted: false,
                            published: isPublished
                        } as Article;
    
                        this.articleService.createArticle(data).pipe(catchError(error => {
                            this.toastr.error('Pri zakladaní článku nastala chyba', 'Refreshni stránku a skús ešte raz.', {
                                positionClass: 'toast-bottom-center',
                                timeOut: 2000
                            });
                            return throwError(error);
                        })).subscribe(() => {
                            const toastMessage = data.published ? 'Nový článok úspešne publikovaný!' : 'Nový článok úspešne uložený!'
                            this.toastr.success(toastMessage, '', {
                                positionClass: 'toast-bottom-center',
                                timeOut: 2000
                            });
                            this.router.navigate(['../'], { relativeTo: this.route })
                        })
                    }
                })

            }
        });
    }
}
