import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, tap } from 'rxjs';
import { SEND_EMAIL_URL } from '../constants/urls';
import { Email } from '../models/email.model';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(private http: HttpClient) {

    }

    sendEmail(email: Email): Observable<any> {
        return this.http.post(SEND_EMAIL_URL, email);
    }
}


