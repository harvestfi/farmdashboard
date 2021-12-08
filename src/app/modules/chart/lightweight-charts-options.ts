import { CrosshairMode } from 'lightweight-charts';
import { format } from 'date-fns';

export class LightweightChartsOptions {
  public static getOptions(): any {
    return {
      layout: {
        backgroundColor: '#2F2C2C',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: 'rgb(67,67,67)',
        },
        horzLines: {
          color: 'rgb(67,67,67)',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
      watermark: {
        color: 'rgba(255,255,255, 0.7)',
        visible: true,
        text: 'Harvest Live Dashboard',
        fontSize: 18,
        horzAlign: 'left',
        vertAlign: 'bottom',
      },
      localization: {
        timeFormatter: businessDayOrTimestamp => {
          const d = new Date(0);
          d.setUTCSeconds(businessDayOrTimestamp);
          return d.toLocaleString();
        },
        // locale: 'en-GB',
      },
      timeScale: {
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const d = new Date(0);
          d.setUTCSeconds(time);
          return format(d, 'dd-MMM HH:mm');
        },
        rightOffset: 50,
      },
    };
  }
}
