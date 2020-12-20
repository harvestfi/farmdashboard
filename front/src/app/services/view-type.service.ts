import {Injectable} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class ViewTypeService {
  public v2Theme = true;

  constructor(private deviceService: DeviceDetectorService) {
  }

  getViewType(): string {
    if (this.v2Theme) {
      return 'v2';
    }
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      return 'mobile';
    }
    return 'desktop';
  }
}
