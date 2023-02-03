import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  screenWidth: number;
  mobileMenuVisible = false;
  langOptions = [
    { nameShort: 'SK', nameLong: 'Slovensky', value: 'sk', imgSrc: './assets/icons/slovakia.png' },
    { nameShort: 'ENG', nameLong: 'English', value: 'en', imgSrc: './assets/icons/united-kingdom.png' }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService) {
    this.screenWidth = window.innerWidth;
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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
  }
}
