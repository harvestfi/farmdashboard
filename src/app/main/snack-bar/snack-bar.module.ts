import {NgModule} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularEmojisModule} from 'angular-emojis';
import {MatIconModule} from '@angular/material/icon';

import {SnackBarComponent} from './snack-bar.component';
import {SnackBarService} from './snack-bar.service';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    MatSnackBarModule,
    BrowserAnimationsModule,
    AngularEmojisModule,
    MatIconModule,
  ],
  exports: [],
  declarations: [
    SnackBarComponent,
  ],
  providers: [
    SnackBarService,
  ],
})
export class SnackBarModule {
}
