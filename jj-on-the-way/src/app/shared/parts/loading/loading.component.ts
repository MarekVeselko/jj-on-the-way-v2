import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoadingComponent implements OnInit {
    isLoading!: boolean;

    constructor(private loadingService: LoadingService,
                private cdr: ChangeDetectorRef) {
        loadingService.isLoading.subscribe((isLoading) => {
            this.isLoading = isLoading;
            cdr.markForCheck();
        })

    }

    ngOnInit(): void {

    }



}
