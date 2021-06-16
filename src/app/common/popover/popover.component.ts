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
  @ContentChild(TemplateRef) template;

}
