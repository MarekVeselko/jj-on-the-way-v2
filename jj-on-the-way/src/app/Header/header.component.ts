import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  mobileMenuVisible = false;
  language = { name: 'sk', value: 'sk' };
  langOptions = [
    { name: 'SK', value: 'sk', imgSrc: './assets/icons/slovakia.png' },
    { name: 'EN', value: 'en', imgSrc: './assets/icons/united-kingdom.png' }
  ];

  constructor(private router: Router,
    private translate: TranslateService) {
    router.events.subscribe((val) => {
      this.mobileMenuVisible = false;
    });
  }

  onLangChange() {
    this.translate.use(this.language.value);
  }
}
