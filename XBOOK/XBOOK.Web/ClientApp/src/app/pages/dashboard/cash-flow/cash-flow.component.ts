import {Component, OnInit, Injector, Input, OnChanges, ElementRef, Renderer2} from '@angular/core';
import { thousandSuffix, convertRemToPixels } from '../../../shared/utils/util';
import { DataService } from '../../_shared/services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/service/common.service';
import { Router } from '@angular/router';
import { NbMediaBreakpointsService, NbThemeService, NbMediaBreakpoint } from '@nebular/theme';
import * as _ from 'lodash';
import { DashboardService } from '../../_shared/services/dashboard.service';
import { DashboardRequest, BalanceChartView } from '../../_shared/models/dashboard/dashboard.model';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ChartBase } from '../chart-base';
import * as moment from 'moment';

@Component({
  selector: 'xb-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss'],
})
export class CashFlowComponent extends ChartBase implements OnInit, OnChanges {
  @Input() data: BalanceChartView = new BalanceChartView();
  options: any;
  fromDay: any;
  toDay: any;
  selectedItem = '1';
  rawLabels: Array<any>;
  rawLegends: Array<any>;
  constructor(
    private datarequest: DataService,
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
    private dashboardService: DashboardService,
    private renderer: Renderer2,
    private el: ElementRef,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.options = this.getOption();

    this.rerenderOnBreakpointChange();

    this.i18nConfig();
  }

  ngOnChanges() {
    if (this.data) {
      this.loadChart(this.data);
    }
  }

  showByMonth() {
    const param = new DashboardRequest();
    param.interval = 'month';
    this.dashboardService.getBalanceChart(param).subscribe((data: BalanceChartView) => {
      this.loadChart(data);
    });
  }

  showByQuater() {
    const param = new DashboardRequest();
    param.interval = 'quater';
    this.dashboardService.getBalanceChart(param).subscribe((data: BalanceChartView) => {
      this.loadChart(data);
    });
  }

  chartObjectMapping(dataInput: Array<any>) {
    const colors = ['#0071c1', '#e46c0d'];
    const datasets: Array<Array<any>> = [];

    dataInput.forEach((item) => {
      item['bars'].forEach(data => {
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

  private navigateToCashBalance( monthParam: string) {
    let firstDate,
        endDate;
    const t = new Date();
    switch (monthParam) {
      case 'Tháng này':
      case 'This month': {
        firstDate = new Date(t.getFullYear(), t.getMonth(), 1).toLocaleDateString('en-GB');
        endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0).toLocaleDateString('en-GB');
        break;
      }
      case 'Tháng 1':
      case 'January': {
        const startDay = new Date(t.getFullYear(), 0, 1);
        const lastDay = new Date(t.getFullYear(), 1, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 2':
      case 'February': {
        const startDay = new Date(t.getFullYear(), 1, 1);
        const lastDay = new Date(t.getFullYear(), 2, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 3':
      case 'March': {
        const startDay = new Date(t.getFullYear(), 2, 1);
        const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 4':
      case 'April': {
        const startDay = new Date(t.getFullYear(), 3, 1);
        const lastDay = new Date(t.getFullYear(), 4, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 5':
      case 'May': {
        const startDay = new Date(t.getFullYear(), 4, 1);
        const lastDay = new Date(t.getFullYear(), 5, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 6':
      case 'June': {
        const startDay = new Date(t.getFullYear(), 5, 1);
        const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 7':
      case 'July': {
        const startDay = new Date(t.getFullYear(), 6, 1);
        const lastDay = new Date(t.getFullYear(), 7, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 8':
      case 'August': {
        const startDay = new Date(t.getFullYear(), 7, 1);
        const lastDay = new Date(t.getFullYear(), 8, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 9':
      case 'September': {
        const startDay = new Date(t.getFullYear(), 8, 1);
        const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 10':
      case 'October': {
        const startDay = new Date(t.getFullYear(), 9, 1);
        const lastDay = new Date(t.getFullYear(), 10, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 11':
      case 'November': {
        const startDay = new Date(t.getFullYear(), 10, 1);
        const lastDay = new Date(t.getFullYear(), 11, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Tháng 12':
      case 'December': {
        const startDay = new Date(t.getFullYear(), 11, 1);
        const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Q1': {
        const startDay = new Date(t.getFullYear(), 0, 1);
        const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Q2': {
        const startDay = new Date(t.getFullYear(), 3, 1);
        const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Q3': {
        const startDay = new Date(t.getFullYear(), 6, 1);
        const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Q4': {
        const startDay = new Date(t.getFullYear(), 9, 1);
        const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-GB');
        endDate = lastDay.toLocaleDateString('en-GB');

        break;
      }
      case 'Quý này':
      case 'This quarter': {
        firstDate = moment().startOf('quarter').toDate().toLocaleDateString('en-GB');
        endDate = moment().endOf('quarter').toDate().toLocaleDateString('en-GB');

        break;
      }
    }
    const genledSearch = {
      startDate: firstDate,
      endDate: endDate,
    };
    this.datarequest.sendMessageMoneyFund(genledSearch);
    this.router.navigate([`/pages/Cashbalance`]);
  }

  private getOption() {
    const send = this;
    const option = {
      onClick(event, element) {

        if (!this.active[0]) {
          return;
        }
        send.navigateToCashBalance(this.active[0]._view.label);
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
      hover: {
        onHover: function (e, element) {
          const point = this.getElementAtEvent(e);
          if (point.length) e.target.style.cursor = 'pointer';
          else e.target.style.cursor = 'default';
          },
        },
      tooltips: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (tooltipItems, data) {
            return thousandSuffix(tooltipItems.yLabel);
          },
        },

        custom: function(tooltipModel){
          const elementId = 'dashboard__cash-flow_tooltip';
          // Tooltip Element
          let tooltipEl = document.getElementById(elementId);

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = send.renderer.createElement('div');
            tooltipEl.id = elementId;
            send.renderer.appendChild(send.el.nativeElement, tooltipEl);
          }

          tooltipEl.onclick = () => {
            send.navigateToCashBalance(this._active[0]._view.label);
          };
          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          // `this` will be the overall tooltip
          const position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.x + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.y + 'px';
          tooltipEl.style.width = tooltipModel.width + 'px';
          tooltipEl.style.height = tooltipModel.height + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.cursor = 'pointer';
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

    const breakpoint = this.breakpointService.getByWidth(width).name;
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

  private i18nConfig() {
    this.translateService.onLangChange
    .pipe( takeUntil(this._onDestroy))
    .subscribe(() => {
      const tempValue = this.selectedItem;
      this.selectedItem = '';
      setTimeout(() => this.selectedItem = tempValue, 0);
      this.translateLabels();
    });

  }

  private translateLabels() {
    const translatedLabels = this.translateService.instant(this.rawLabels);
    const translatedLegends = this.translateService.instant(this.rawLegends);

    this.data.chart.labels =  this.rawLabels.map(label => translatedLabels[label]);
    this.rawLegends.forEach((legend, index) => {
      this.data.chart.datasets[index].label = translatedLegends[legend];
    });
    // refresh chart
    this.data.chart = {...this.data.chart};
  }

  private loadChart(data) {
    this.data = data;
    this.data.chart = this.chartObjectMapping(data.chart);
    this.rawLegends = this.data.chart.datasets.map(dataset => dataset.label);
    this.rawLabels = this.data.chart.labels;
    this.translateLabels();
  }
}
