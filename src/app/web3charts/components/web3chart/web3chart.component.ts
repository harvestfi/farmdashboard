import { IChartApi } from 'lightweight-charts'
import { ChartBuilder } from './../../../chart/chart-builder'
import { ChartGeneralMethodsComponent } from 'src/app/chart/chart-general-methods.component'
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, ElementRef, OnChanges } from '@angular/core'

@Component({
  selector: 'app-web3chart',
  templateUrl: './web3chart.component.html',
  styleUrls: ['./web3chart.component.css']
})
export class Web3chartComponent extends ChartGeneralMethodsComponent implements OnInit, OnChanges {
  @ViewChild('chart') chartEl: ElementRef
  @Input('data') public data: Array<{timestamp: number; value: number}>
  @Input('label') public label: string
  chart: IChartApi

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { 
    super()
  }

  ngOnInit(): void {
  }

  ngOnChanges(props): void {
    this.handleData(props.data.currentValue)
  }

  handleData(data) {
    console.log('data', data)
    if (data === null) {
      return
    }

    if (this.chart) {
      this.chart.remove()
    }

    const chartBuilder = new ChartBuilder()
    chartBuilder.initVariables(1)
    data.forEach(el => {
      chartBuilder.addInData(0, el.timestamp, el.value)
    })
    
    this.cdRef.detectChanges()
    this.chart = chartBuilder.initChart(this.chartEl)
    chartBuilder.addToChart(this.chart, [[this.label, 'right', '#7e7e7e']])
  }
}
