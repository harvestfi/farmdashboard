import {Component, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewTypeService} from '../../services/view-type.service';
import {UserSettings} from '../../user-settings';
import {CustomModalComponent} from 'src/app/dialogs/custom-modal/custom-modal.component';

@Component({
  selector: 'app-main-side-menu',
  templateUrl: './main-side-menu.component.html',
  styleUrls: ['./main-side-menu.component.scss'],
  animations: [
    trigger('openMenu', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.45s')
      ]),
    ]),
  ]
})
export class MainSideMenuComponent {
  showSideMenu = false;
  isDarkTheme = UserSettings.getColor() === 'dark' ? true : false;
  @ViewChild('allStatsDialog') private allStatsDialog: CustomModalComponent;
  @ViewChild('tvlDialog') private tvlDialog: CustomModalComponent;
  @ViewChild('incomeDialog') private incomeDialog: CustomModalComponent;
  @ViewChild('psApyDialog') private psApyDialog: CustomModalComponent;
  @ViewChild('weeklyProfitDialog') private weeklyProfitDialog: CustomModalComponent;
  @ViewChild('weeklyRewardsDialog') private weeklyRewardsDialog: CustomModalComponent;
  @ViewChild('farmBuybackDialog') private farmBuybackDialog: CustomModalComponent;
  @ViewChild('savedFeesDialog') private savedFeesDialog: CustomModalComponent;
  @ViewChild('userBalancesDialog') private userBalancesDialog: CustomModalComponent;
  @ViewChild('downloadHistoricDataDialog') private downloadHistoricDataDialog: CustomModalComponent;

  constructor(public viewTypeService: ViewTypeService) {
  }

  toggleMenu(): void {
    this.showSideMenu = !this.showSideMenu;
  }

  openAllStatsDialog(): void {
    this.allStatsDialog.open();
    this.toggleMenu();
  }

  openTvlDialog(): void {
    this.tvlDialog.open();
    this.toggleMenu();
  }

  openIncomeDialog(): void {
    this.incomeDialog.open();
    this.toggleMenu();
  }

  openPsApyDialog(): void {
    this.psApyDialog.open();
    this.toggleMenu();
  }

  openWeeklyProfitDialog(): void {
    this.weeklyProfitDialog.open();
    this.toggleMenu();
  }

  openWeeklyRewardsDialog(): void {
    this.weeklyRewardsDialog.open();
    this.toggleMenu();
  }

  openFarmBuybacksDialog(): void {
    this.farmBuybackDialog.open();
    this.toggleMenu();
  }

  openSavedFeesDialog(): void {
    this.savedFeesDialog.open();
    this.toggleMenu();
  }


  openUserBalances(): void {
    this.userBalancesDialog.open();
    this.toggleMenu();
  }

  openDownloadHistoricDataDialog(): void {
    this.downloadHistoricDataDialog.open();
    this.toggleMenu();
  }

  toggleTheme(): void {
    if (this.viewTypeService.getThemeColor() === 'dark') {
      this.viewTypeService.setThemeColor('light');
      return;
    }
    this.viewTypeService.setThemeColor('dark');
  }
}
