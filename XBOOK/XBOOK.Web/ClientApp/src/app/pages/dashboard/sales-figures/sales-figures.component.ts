import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xb-sales-figures',
  templateUrl: './sales-figures.component.html',
  styleUrls: ['./sales-figures.component.scss',
],
})
export class SalesFiguresComponent implements OnInit {
  data: any;
  options: any;

  constructor() {
    this.showByMonth();
    this.options = this.getOption();
  }

  ngOnInit() {
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
        label: 'Apr',
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

  showByQuater() {
    const data = [
      {
        label: 'Q1',
        value: 3300,
      },
      {
        label: 'Q2',
        value: 700,
      },
      {
        label: 'Q3',
        value: 3500,
      },
      {
        label: 'Q4',
        value: 1400,
      },
    ];
    this.data = this.chartObjectMapping(data);

  }

  showByYear() {
    const data = [
      {
        label: '2016',
        value: 1300,
      },
      {
        label: '2017',
        value: 5700,
      },
      {
        label: '2018',
        value: 4500,
      },
      {
        label: '2019',
        value: 400,
      },
      {
        label: '2020',
        value: 1400,
      },
    ];
    this.data = this.chartObjectMapping(data);
  }

  private chartObjectMapping(dataInput: Array<any>) {
    return {
      labels: dataInput.map(item => item.label),
      datasets: [{
        data: dataInput.map(item => item.value),
        label: 'Series1',
        backgroundColor: '#4d75a8',
        borderColor: '#4d75a8',
        borderCapStyle: 'square',
        fill: false,
        lineTension: 0,
        pointStyle: 'rect',
      },
      ],
    };
  }

  private getOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              offsetGridLines: true,
              display: false,
            },
            ticks: {
              fontColor: '#000',
            },
            offset: true,
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: '#858585',
            },
            ticks: {
              fontColor: '#000',
              beginAtZero: true,
            },
          },
        ],
      },
      legend: {
        position: 'right',
        labels: {
          fontColor: '#000',
          backgroundColor: '#5177a6',
          usePointStyle: true,
        },
      },
      events: ['mousemove', 'click'],
    };
  }
}
