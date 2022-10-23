import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, tap } from 'rxjs';
import { LOGIN_URL } from '../constants/urls';
import { IUserLogin } from '../interfaces/IUserLogin';
import { User } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    isLoggedIn = false;
    private userSubject = new BehaviorSubject<User>(new User());
    public userObservable: Observable<User>;

    constructor(private http: HttpClient) {
        this.userObservable = this.userSubject.asObservable();
    }

    login(userLogin: IUserLogin): Observable<User> {
        return this.http.post<User>(LOGIN_URL, userLogin).pipe(
            tap({
                next: (user) => {
                    this.isLoggedIn = true;
                    // TODO: SHOW SUCCESS TOAST
                },
                error: (error) => {
                    // TODO: SHOW ERROR TOAST

                }
            }));
    }
}


