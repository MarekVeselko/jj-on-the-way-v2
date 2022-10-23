import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
    isSubmitted = false;
    isLoggedIn = false;

    readonly loginControls = {
        pin: new FormControl('', Validators.required)
    }

    loginForm: FormGroup = new FormGroup(this.loginControls);

    constructor(private router: Router,
        private userService: UserService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef) {
    }

    onInputChange() {
        if (this.loginControls.pin.value?.length == 4) {
            this.onSubmit();
        }
    }


    onSubmit() {
        this.isSubmitted = true;
        if (!this.loginForm.valid) {
            this.loginControls.pin.markAsTouched();
            return;
        }

        this.userService.login({ pin: this.loginControls.pin.value }).pipe(catchError(error => {
            this.toastr.error('Nesprávny PIN', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000
            });
            this.loginControls.pin.patchValue(null);
            return of (null);
        })).subscribe();
    }
}
