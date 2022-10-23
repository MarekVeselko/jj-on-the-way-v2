import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-title-photo',
  templateUrl: './title-photo.component.html',
  styleUrls: ['./title-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitlePhotoComponent {
  inAdminMode = false;

  constructor(private router: Router,
    private cdr: ChangeDetectorRef) {

    router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        this.inAdminMode = val.url.startsWith('/admin') || val.url.includes('/detail/') ;  
        this.cdr.markForCheck();       
    }
    });
  }
}
