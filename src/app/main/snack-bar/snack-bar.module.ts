import {NgModule} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SnackBarComponent} from './snack-bar.component';
import {SnackBarService} from './snack-bar.service';

/**
 * Candindate for /shared/
 */
@NgModule({
  imports: [
    MatSnackBarModule,
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
