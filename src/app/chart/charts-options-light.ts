export class ChartsOptionsLight {
  public static getOptions(color: string): any {
    const options = {
      light: {
        layout: {
          backgroundColor: 'rgba(255, 255, 255, 0)',
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
      },
      dark: {
        layout: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          textColor: 'rgba(255,255,255,0.9)',
        },
        watermark: {
          color: 'rgba(255,255,255,0.7)',
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
      }
    }
    return options[color];
  }
}
