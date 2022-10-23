import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from 'rxjs';
import { LoadingService } from "../services/loading.service";

let pendingRequests = 0;

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingService.showLoading();
        pendingRequests = pendingRequests + 1;
        return next.handle(req).pipe(
            tap({
                next: (event) => {
                    if (event.type === HttpEventType.Response) {
                        this.handleHideLoading();
                    }
                },
                error: () => { this.handleHideLoading() }
            })
        );
    }

    handleHideLoading() {
        pendingRequests = pendingRequests - 1;
        if (pendingRequests == 0) {
            this.loadingService.hideLoading();
        }
    }
}