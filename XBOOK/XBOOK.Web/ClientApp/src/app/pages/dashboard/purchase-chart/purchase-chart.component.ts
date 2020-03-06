import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-purchase-chart',
  templateUrl: './purchase-chart.component.html',
  styleUrls: ['./purchase-chart.component.scss'],
})
export class PurchaseChartComponent implements OnInit {
  data: any;
  options: any;

  constructor() { }

  ngOnInit() {
    this.showByMonth();
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        rectangle: {
          borderWidth: 2,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              color: 'blue',
              drawBorder: false,
            },
            ticks: {
              fontColor: 'black',
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
    };
  }

  showByWeek() {
    const data = [
      {
        label: '2 tuần trước',
        value: 300,
      },
      {
        label: 'Tuần trước',
        value: 700,
      },
      {
        label: 'Tuần này',
        value: 500,
      },
      {
        label: 'Tuần sau',
        value: 400,
      },
      {
        label: '2 Tuần sau',
        value: 100,
      },
    ];
    this.data = this.chartObjectMapping(data);
  }

  showByMonth() {
    const data = [
      {
        label: 'Feb',
        value: 2300,
      },
      {
        label: 'Mar',
        value: 1200,
      },
      {
        label: 'Tháng này',
        value: 3500,
      },
      {
        label: 'May',
        value: 800,
      },
      {
        label: 'Jun',
        value: 2500,
      },
    ];
    this.data = this.chartObjectMapping(data);
  }

  private chartObjectMapping(dataInput: Array<any>) {
    return {
      labels: dataInput.map(item => item.label),
      datasets: [{
        data: dataInput.map(item => item.value),
        backgroundColor: ['#d9d8da', '#d9d8da', '#4d75a8', '#c7d9f1', '#c7d9f1'],
      },
      ],
    };
  }
}
