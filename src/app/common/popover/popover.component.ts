// /* eslint-disable @angular-eslint/no-output-on-prefix */
import {Component, ContentChild, TemplateRef} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

/**
 * @todo(dmitry2199): to rename selector or component name, they should be same
 */
@Component({
  selector: 'app-popover-card',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  public vt: ViewTypeService = new ViewTypeService();
  private hover = false;
  @ContentChild(TemplateRef) template;

  maybeOpen(popoverRef){
    this.hover = true;
    popoverRef.open();
  }

  timeDelayClose(popoverRef, delay= 500){
    setTimeout(() => {
      if(!this.hover) {
        this.hover = false;
        popoverRef.close();
      }
    },500);
  }

  maintainOpen(popoverRef) {
    this.hover = true;
  }

  leavePopover(popoverRef){
    this.hover = false;
    this.timeDelayClose(popoverRef,200);
  }
}
