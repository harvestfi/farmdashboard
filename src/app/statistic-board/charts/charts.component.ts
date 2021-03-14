import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

type ChartItem = {
  x: string;
  y: string;
  title: string;
  percent: string;
  annual: string;
  ytitle: string;
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnChanges {
  @Input('data') data: ChartItem[]

  charts = []

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.charts = changes.data.currentValue.map(this.makeChartProps)
  }

  makeChartProps(chart: ChartItem) {
    return {
      data: [
        {
          x: chart.x,
          y: chart.y,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {
            color: 'green'
          }  
        },                
      ],
      layout: {
          width: 320, 
          height: 330, 
          plot_bgcolor: "#FFFCE6",
          paper_bgcolor: "#FFFCE6",
          title: "<b>" + chart.title + "</b>",
          titlefont: {
            family: 'Monospace',
            size: 28,
            color: '#333'
          },
          xaxis:{
            title: "<b>x: block number</b>" + chart.percent + chart.annual,
            titlefont: {
            family: 'Monospace',
            size: 14,
            color: '#333'
          }
        }, 
          yaxis:{
            title: chart.ytitle,
            titlefont: {
              family: 'Monospace',
              size: 14,
              color: '#333'
          }
        }
      }
    }
  }
}
