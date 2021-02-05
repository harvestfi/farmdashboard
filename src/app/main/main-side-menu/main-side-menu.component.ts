import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AllStatsDialogComponent } from '../../dialogs/all-stats-dialog/all-stats-dialog.component';
import { TvlDialogComponent } from '../../dialogs/tvl-dialog/tvl-dialog.component';
import { RewardsDialogComponent } from '../../dialogs/rewards-dialog/rewards-dialog.component';
import { ViewTypeService } from '../../services/view-type.service';
import { ProfitDialogComponent } from '../../dialogs/profit-dialog/profit-dialog.component';
import { FarmBuybacksDialogComponent } from '../../dialogs/farm-buybacks-dialog/farm-buybacks-dialog.component';
import { HardWorkHistoryDialogComponent } from '../../dialogs/hard-work-history-dialog/hard-work-history-dialog.component';
import { UserSettings } from '../../user-settings';
import { MatDialog } from '@angular/material/dialog';
import { CustomModalComponent } from 'src/app/dialogs/custom-modal/custom-modal.component';




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
    isDarkTheme = UserSettings.getTheme() === 'scoreboard' ? true : false;
    @ViewChild('allStatsDialog') private allStatsDialog: CustomModalComponent
    @ViewChild('tvlDialog') private tvlDialog: CustomModalComponent
    @ViewChild('incomeDialog') private incomeDialog: CustomModalComponent
    @ViewChild('psApyDialog') private psApyDialog: CustomModalComponent
    @ViewChild('weeklyProfitDialog') private weeklyProfitDialog: CustomModalComponent
    @ViewChild('farmBuybackDialog') private farmBuybackDialog: CustomModalComponent
    @ViewChild('savedFeesDialog') private savedFeesDialog: CustomModalComponent

    constructor(private dialog: MatDialog, private viewTypeService: ViewTypeService) {}  

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
        // this.dialog.open(RewardsDialogComponent, {
        //     width: '100%',
        //     height: 'auto',
        //     data: {
        //         title: 'PS APY History',
        //         name: ''
        //     }
        // });
        this.toggleMenu();
    }

    openWeeklyProfitDialog(): void {
        this.weeklyProfitDialog.open();
        // this.dialog.open(ProfitDialogComponent, {
        //     width: '100%',
        //     height: 'auto',
        //     data: {
        //         title: 'Weekly profit history chart',
        //         name: 'Name'
        //     }
        // });
        this.toggleMenu();
    }

    openFarmBuybacksDialog(): void {
        this.farmBuybackDialog.open();
        // this.dialog.open(FarmBuybacksDialogComponent, {
        //     width: '100%',
        //     height: 'auto',
        //     data: {
        //         title: 'FARM Buyback history chart',
        //         name: 'Name'
        //     }
        // });
        this.toggleMenu();
    }

    openSavedFeesDialog(): void {
        // this.dialog.open(HardWorkHistoryDialogComponent, {
        //     width: '100%',
        //     height: 'auto',
        //     data: {
        //         title: 'Saved Gas Fees History',
        //         name: 'Name'
        //     }
        // });
        this.savedFeesDialog.open();
        this.toggleMenu();
    }


    toggleTheme(): void {
        this.viewTypeService.toggleTheme();
    }
}
