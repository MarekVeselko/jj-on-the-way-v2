import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  mobileMenuVisible = false;
  langOptions = [
    { name: 'SK', value: 'sk', imgSrc: './assets/icons/slovakia.png' },
    { name: 'EN', value: 'en', imgSrc: './assets/icons/united-kingdom.png' }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService) {
    router.events.subscribe((val) => {
      this.mobileMenuVisible = false;
    });

  }

  onLangChange(lang: string) {
    this.translate.use(lang);
    if (this.router.url.startsWith('/blog/detail/')) {
      setTimeout(() => {
        this.router.navigate(['./blog']);
      }, 200)
    }

  }
}
