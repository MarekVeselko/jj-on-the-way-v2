import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-article-dialog',
    templateUrl: './article-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDialogComponent {

    readonly controls = {
        pin: new FormControl('', Validators.required)
    }

    form: FormGroup = new FormGroup(this.controls);

    constructor(
        private cdr: ChangeDetectorRef) {
    }


    onSubmit() {
        if (!this.form.valid) {
            this.controls.pin.markAsTouched();
        } else {
            return this.form.value;
        }
    }
}
