import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticlesService } from 'src/app/shared/services/articles.service';

@Component({
    selector: 'app-image-dialog',
    templateUrl: './image-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private articleService: ArticlesService) {}

    getImageId(imageUrl: string) {
        return this.articleService.getImageId(imageUrl);
      }
}
