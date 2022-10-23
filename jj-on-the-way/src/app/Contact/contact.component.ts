import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of, throwError } from 'rxjs';
import { EmailService } from '../shared/services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  @ViewChild('other') other!: any;
  @ViewChild('cooperation') cooperation!: any;
  @ViewChild('information') information!: any;
  @ViewChild('ideas') ideas!: any;
  contactReasons: string[] = [];
  messageSent = false;
  readonly controls = {
    name: new FormControl(null, Validators.required),
    surname: new FormControl(null),
    contactReason: new FormControl([''], Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    text: new FormControl(null, Validators.required)
  }

  form: FormGroup = new FormGroup(this.controls);

  constructor(private emailService: EmailService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef) { }

  onCheckboxChecked(name: string, value: boolean) {
    if (value) this.contactReasons.push(name);
    else this.contactReasons.splice(this.contactReasons.indexOf(name), 1);
  }


  onSubmit() {
    if (this.form.valid) {
      this.controls.contactReason.patchValue(this.contactReasons);
      console.log(this.form.value);

      this.emailService.sendEmail(this.form.value).pipe(catchError((err) => {
        this.toastr.error('Pri odosielaní správy nastala nečakaná chyba!', 'Refreshnite stránku a skúste ešte raz.', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000
      });
        return throwError(err);
      })).subscribe(response => {
        this.form.patchValue({
          name: null,
          surname: null,
          contactReason: [''],
          email: null,
          text: null
        });
        this.other.checked = false;
        this.cooperation.checked = false;
        this.information.checked = false;
        this.ideas.checked = false;
        this.contactReasons = [];
        this.form.markAsUntouched();
        this.cdr.markForCheck();

        this.messageSent = true;
      })

    } else this.form.markAllAsTouched();
  }
}
