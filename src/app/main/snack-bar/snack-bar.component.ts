import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {
  }

  ngOnInit(): void {
  }

  chooseColor(data: string): string {
    data = data.toLowerCase();
    if (data.indexOf('buy') >= 0 || data.indexOf('add') >= 0 || data.indexOf('deposit') >= 0) {
      return '#3e5f35';
    } else if (data.indexOf('sell') >= 0 || data.indexOf('remove') >= 0 || data.indexOf('withdraw') >= 0) {
      return '#b34a4a';
    }
  }

  public dismiss(): void {
    this.snackBarRef.dismiss();
  }

}
