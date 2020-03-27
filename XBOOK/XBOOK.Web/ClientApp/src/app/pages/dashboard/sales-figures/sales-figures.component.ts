import { Component, OnInit } from '@angular/core';
import { thousandSuffix, convertRemToPixels } from '../../../shared/utils/util';
import { NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as _ from 'lodash';

@Component({
  selector: 'xb-sales-figures',
  templateUrl: './sales-figures.component.html',
  styleUrls: ['./sales-figures.component.scss',
],
})
export class SalesFiguresComponent implements OnInit {
  data: any;
  options: any;

  constructor(
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
  ) {
    this.showByMonth();
    this.options = this.getOption();

    this.rerenderOnBreakpointChange();
  }

  ngOnInit() {
  }

  showByMonth() {
    const data = [
      {
        label: 'Feb',
        value: 23000000,
      },
      {
        label: 'Mar',
        value: 1200000,
      },
      {
        label: 'Apr',
        value: 35000000,
      },
      {
        label: 'May',
        value: 8000000,
      },
      {
        label: 'Jun',
        value: 25000000,
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
        data: dataInput.map(item => item.value / 1000000),
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
    const option = {
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
              fontFamily: 'Montserrat',
              precision: 3,
              beginAtZero: true,
              callback: function (label, index, labels) {
                return thousandSuffix(label);
              },
            },
          },
        ],
      },
      legend: {
        position: 'right',
        labels: {
          fontColor: '#000',
          backgroundColor: '#5177a6',
          fontFamily: 'Montserrat',
          usePointStyle: true,
        },
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItems, data) {
            return thousandSuffix(tooltipItems.yLabel);
          },
        },
      },
      events: ['mousemove', 'click'],
    };

    const customOption = this.responsiveTextOption(window.innerWidth);

    return _.merge(option, customOption);
  }

  private responsiveTextOption(width: number) {
    let customOption;

    const breakpoint =  this.breakpointService.getByWidth(width).name;
    switch (breakpoint) {
      /**
       * Breakpoint Medium - 768px
       */
      case 'md':
        customOption = {
          scales: {
            yAxes: [
              {
                ticks: {
                  fontSize: convertRemToPixels(0.8),
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: convertRemToPixels(0.8),
            },
          },
        };
      break;
      /**
       * Breakpoint Large - 992px
       */
      case 'lg':
        customOption = {
          scales: {
            yAxes: [
              {
                ticks: {
                  fontSize: convertRemToPixels(0.5),
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: convertRemToPixels(0.5),
            },
          },
        };
      break;
      /**
       * Default
       */
      default:
        customOption = {
          scales: {
            yAxes: [
              {
                ticks: {
                  fontSize: convertRemToPixels(0.6),
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: convertRemToPixels(0.8),
            },
          },
        };
    }

    return customOption;
  }

  private rerenderOnBreakpointChange() {
    this.themeService.onMediaQueryChange()
      .subscribe(([, currentBreakpoint]) => {
          this.options = this.getOption();
      });
  }
}
