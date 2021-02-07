import {CrosshairMode} from 'lightweight-charts';

import * as moment from 'moment';

export class BalanceChartDarkOptions {
  public static getOptions(): any {
    return {
      // width: 700,
      // height: 500,

      layout: {
        backgroundColor: '#6d6d69',
        textColor: 'rgba(255,255,255,0.9)',
      },
      grid: {
        vertLines: {
          visible: false,
          color: 'rgb(255,255,255)',
        },
        horzLines: {
          visible: false,
          color: 'rgb(255,255,255)',
        },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        }
      },
      watermark: {
        color: 'rgba(255,255,255, 0.7)',
        visible: false,
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
          return (moment(d)).format('DD-MMM');
        },
      },
      rightPriceScale: {
        autoScale: false,
        visible: true,
        borderVisible: false,
        drawTicks: false
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false
      },
      handleScale: {
        mouseWheel: false,
        axisPressedMouseMove: false,
        pinch: false
      }
    };
  }
}
