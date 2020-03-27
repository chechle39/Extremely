import { Component, OnInit, Injector } from '@angular/core';
import { thousandSuffix, convertRemToPixels } from '../../../shared/utils/util';
import { DataService } from '../../_shared/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/service/common.service';
import { Router } from '@angular/router';
import { NbMediaBreakpointsService, NbThemeService, NbMediaBreakpoint } from '@nebular/theme';
import * as _ from 'lodash';

@Component({
  selector: 'xb-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss'],
})
export class CashFlowComponent implements OnInit {
  data: any;
  options: any;
  fromDay: any;
  toDay: any;
  constructor(
    private datarequest: DataService,
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.showByMonth();

    this.options = this.getOption();

    this.rerenderOnBreakpointChange();
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
          data: data.map(value => value / 1000000),
          backgroundColor: colors[index % colors.length],
        };
      }),
    };
  }

  private getOption() {
    const send = this;
    const option = {
      onClick() {
        if (!this.active[0]) {
          return;
        }
        switch (this.active[0]._view.label) {
          case 'Jan': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 0, 1);
            const lastDay = new Date(t.getFullYear(), 1, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Feb': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 1, 1);
            const lastDay = new Date(t.getFullYear(), 2, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Mar': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 2, 1);
            const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Apr': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 3, 1);
            const lastDay = new Date(t.getFullYear(), 4, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'May': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 4, 1);
            const lastDay = new Date(t.getFullYear(), 5, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Jun': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 5, 1);
            const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Jul': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 6, 1);
            const lastDay = new Date(t.getFullYear(), 7, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Aug': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 7, 1);
            const lastDay = new Date(t.getFullYear(), 8, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Sep': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 8, 1);
            const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Oct': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 9, 1);
            const lastDay = new Date(t.getFullYear(), 10, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Nov': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 10, 1);
            const lastDay = new Date(t.getFullYear(), 11, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Dec': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 11, 1);
            const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Q1': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 0, 1);
            const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Q2': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 3, 1);
            const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Q3': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 6, 1);
            const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
          case 'Q4': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 9, 1);
            const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-GB');
            this.endDate = lastDay.toLocaleDateString('en-GB');

            break;
          }
        }
        const genledSearch = {
          startDate: this.firstDate,
          endDate: this.endDate,
        };
        send.datarequest.sendMessageMoneyFund(genledSearch);
        send.router.navigate([`/pages/moneyfund`]);


      },
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
              fontFamily: 'Montserrat',
              precision: 3,
              maxTicksLimit: 6,
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
        fullWidth: false,
        labels: {
          fontColor: '#000',
          fontFamily: 'Montserrat',
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
