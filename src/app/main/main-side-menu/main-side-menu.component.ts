import { Component, HostBinding } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { AllStatsDialogComponent } from "../../dialogs/all-stats-dialog/all-stats-dialog.component";
import { TvlDialogComponent } from '../../dialogs/tvl-dialog/tvl-dialog.component';
import { RewardsDialogComponent } from '../../dialogs/rewards-dialog/rewards-dialog.component';
import { ViewTypeService } from '../../services/view-type.service';

import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: "app-main-side-menu",
    templateUrl: "./main-side-menu.component.html",
    styleUrls: ["./main-side-menu.component.css"],
    animations: [
        trigger('openMenu', [
            state('open', style({
                transform: "translateX(0%)"
            })),
            state('closed', style({
                transform: "translateX(-100%)"
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

    constructor(private dialog: MatDialog, private viewTypeService: ViewTypeService) {

    }

    toggleMenu() {
        this.showSideMenu = !this.showSideMenu;
    }

    openAllStats(): void {
        this.dialog.open(AllStatsDialogComponent, {
            data: {}
        });
        this.toggleMenu();
    }

    openTvlDialog(): void {
        this.dialog.open(TvlDialogComponent, {
            width: '100%',
            height: 'auto',
            data: {
                type: 'All'
            }
        });
        this.toggleMenu();
    }

    openIncomeDialog(): void {
        this.dialog.open(TvlDialogComponent, {
            width: '100%',
            height: 'auto',
            data: {
                type: 'income'
            }
        });
        this.toggleMenu();
    }

    openPsApyDialog(): void {
        this.dialog.open(RewardsDialogComponent, {
            width: '100%',
            height: 'auto',
            data: {
                title: 'PS APY History',
                name: ''
            }
        });
        this.toggleMenu();
    }

    toggleTheme(): void {
        this.viewTypeService.toggleTheme();
    }
}