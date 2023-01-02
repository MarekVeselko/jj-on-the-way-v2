import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {
  title = 'jj-on-the-way';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('sk');
    this.translate.use(localStorage.getItem('lang') || 'sk');
  }
}
