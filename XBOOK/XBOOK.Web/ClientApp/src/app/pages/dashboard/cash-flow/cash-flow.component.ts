import { Component, OnInit } from '@angular/core';
import { thousandSuffix } from '../../../shared/utils/util';

@Component({
  selector: 'xb-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss'],
})
export class CashFlowComponent implements OnInit {
  data: any;
  options: any;

  constructor() {
  }

  ngOnInit() {
    this.showByMonth();

    this.options = this.getOption();
  }

  showByMonth() {
    const data = [
      {
        label: 'Jan',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 41000000000,
          },
          {
            label: 'Tiền Chi',
            value: 84000000000,
          },
        ],
      },
      {
        label: 'Feb',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 65000000000,
          },
          {
            label: 'Tiền Chi',
            value: 12000000000,
          },
        ],
      },
      {
        label: 'Mar',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 33000000000,
          },
          {
            label: 'Tiền Chi',
            value: 28000000000,
          },
        ],
      },
      {
        label: 'Apr',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 75000000000,
          },
          {
            label: 'Tiền Chi',
            value: 42000000000,
          },
        ],
      },
      {
        label: 'May',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 44000000000,
          },
          {
            label: 'Tiền Chi',
            value: 55000000000,
          },
        ],
      },
    ];
    this.data = this.chartObjectMapping(data);
  }

  showByQuater() {
    const data = [
      {
        label: 'Q1',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 11,
          },
          {
            label: 'Tiền Chi',
            value: 24,
          },
        ],
      },
      {
        label: 'Q2',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 45,
          },
          {
            label: 'Tiền Chi',
            value: 72,
          },
        ],
      },
      {
        label: 'Q3',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 83,
          },
          {
            label: 'Tiền Chi',
            value: 18,
          },
        ],
      },
      {
        label: 'Q4',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 55,
          },
          {
            label: 'Tiền Chi',
            value: 62,
          },
        ],
      },
    ];
    this.data = this.chartObjectMapping(data);
  }

  chartObjectMapping(dataInput: Array<any>) {
    const colors = ['#0071c1', '#e46c0d'];
    const datasets: Array<Array<any>> = [];
    dataInput.forEach((item) => {
      item['datasets'].forEach(data => {
        if (datasets[data.label] === undefined) {
          datasets[data.label] = [];
        }
        datasets[data.label].push(data.value);
      });
    });

    return {
      labels: dataInput.map(item => item.label),
      datasets: Object.entries(datasets).map(([label, data], index) => {
        return {
          label: label,
          data: data,
          backgroundColor: colors[index % colors.length],
        };
      }),
    };
  }

  private getOption() {
    return {
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
              drawOnChartArea: false,
            },
            ticks: {
              fontColor: 'black',
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
            ticks: {
              fontColor: '#000',
              fontSize: 8,
              fontFamily: 'Montserrat',
              beginAtZero: true,
              callback: function (label, index, labels) {
                return thousandSuffix(label);
              },
            },
          },
        ],
      },
      legend: {
        position: 'top',
        labels: {
          fontColor: 'black',
        },
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItems, data) {
            return thousandSuffix(tooltipItems.yLabel);
          },
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        },
      },
      events: ['mousemove', 'click'],
    };
  }
}
