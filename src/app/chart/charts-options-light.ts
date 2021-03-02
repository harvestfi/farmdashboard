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
        },
        rightPriceScale: {
          borderColor: 'rgb(169,168,168)',
          visible: true,
        },
        timeScale: {
          borderColor: 'rgb(169,168,168)',
          rightOffset: 50
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
            color: '#333535',
          },
          horzLines: {
            color: '#333535',
          },
        },
        leftPriceScale: {
          borderColor: '#333535',
        },
        rightPriceScale: {
          borderColor: '#333535',
          visible: true,
        },
        timeScale: {
          borderColor: '#333535',
          rightOffset: 50
        }
      }
    };
    return options[color];
  }
}
