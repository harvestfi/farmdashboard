import { Component, OnInit, Input } from '@angular/core';

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
export class ChartsComponent implements OnInit {
  @Input('data') data: ChartItem[]

  constructor() { }

  ngOnInit(): void {
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
          width: 520, 
          height: 420, 
          plot_bgcolor: "#FFFCE6",
          paper_bgcolor: "#FFFCE6",
          title: "<b>" + chart.title + "</b>",
          titlefont: {
            family: 'Monospace',
            size: 34,
            color: '#333'
          },
          xaxis:{
            title: "<b>x: block number</b>" + chart.percent + chart.annual,
            titlefont: {
            family: 'Monospace',
            size: 16,
            color: '#333'
          }
        }, 
          yaxis:{
            title: chart.ytitle,
            titlefont: {
              family: 'Monospace',
              size: 16,
              color: '#333'
          }
        }
      }
    }
  }
}
