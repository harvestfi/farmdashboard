export class ChartsOptionsLight {
  public static getOptions(): any {
    return {
      // height: 400,
      layout: {
        backgroundColor: '#fffce6',
        textColor: 'rgba(0,0,0,0.9)',
      },
      watermark: {
        color: 'rgba(0,0,0,0.7)',
      },
      grid: {
        vertLines: {
          color: 'rgb(169,168,168)',
        },
        horzLines: {
          color: 'rgb(169,168,168)',
        },
      },
      leftPriceScale: {
        borderColor: 'rgb(169,168,168)',
        // visible: true,
      },
      rightPriceScale: {
        borderColor: 'rgb(169,168,168)',
        visible: true,
      },
      timeScale: {
        borderColor: 'rgb(169,168,168)',
      }
    };
  }
}
