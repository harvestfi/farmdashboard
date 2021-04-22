// /* eslint-disable @angular-eslint/no-output-on-prefix */
import {Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {ViewTypeService} from '../../services/view-type.service';

@Component({
    selector: 'app-popover-card',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
    public vt: ViewTypeService = new ViewTypeService();
    @ContentChild(TemplateRef) template;

}
