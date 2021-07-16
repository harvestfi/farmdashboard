import {NgModule} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AngularEmojisModule} from 'angular-emojis';
import {MatIconModule} from '@angular/material/icon';

import {SnackBarComponent} from './snack-bar.component';
import {CommonModule} from '@angular/common';
import {SnackBarService} from './snack-bar.service';

/**
 * Candidate for /shared/
 */
@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    AngularEmojisModule,
    MatIconModule,
  ],
  exports: [
    SnackBarComponent,
  ],
  declarations: [
    SnackBarComponent,
  ],
  providers: [
    SnackBarService,
  ],
})
export class SnackBarModule {
}
