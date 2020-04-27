import {Component, OnInit, Input, OnChanges, Renderer2, ElementRef} from '@angular/core';
import {thousandSuffix} from '../../../shared/utils/util';
import * as moment from 'moment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../shared/service/common.service';
import {Router} from '@angular/router';
import {DataService} from '../../_shared/services/data.service';
import {DashboardService} from '../../_shared/services/dashboard.service';
import {DashboardRequest, PurchaseChartView} from '../../_shared/models/dashboard/dashboard.model';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ChartBase } from '../chart-base';

@Component({
  selector: 'xb-purchase-chart',
  templateUrl: './purchase-chart.component.html',
  styleUrls: ['./purchase-chart.component.scss'],
})
export class PurchaseChartComponent extends ChartBase implements OnInit, OnChanges {
  @Input() data: PurchaseChartView = new PurchaseChartView();
  options: any;
  selectedItem = '2';
  rawLabels: Array<any>;
  constructor(
    private datarequest: DataService,
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
    this.i18nConfig();
  }

  ngOnChanges() {
    if (this.data) {
      this.loadChart(this.data);
    }
  }

  NewBuyInvoice() {
    this.router.navigate([`pages/buyinvoice/new`]);
  }

  showByWeek() {
    const param = new DashboardRequest();
    param.interval = 'week';
    this.dashboardService.getPurchaseChart(param).subscribe((data: PurchaseChartView) => {
      this.loadChart(data);
    });
  }

  showByMonth() {
    const param = new DashboardRequest();
    param.interval = 'month';
    this.dashboardService.getPurchaseChart(param).subscribe((data: PurchaseChartView) => {
      this.loadChart(data);
    });
  }

  private chartObjectMapping(dataInput: Array<any>) {
    return {
      labels: dataInput.map(item => item.label),
      datasets: [{
        data: dataInput.map(item => item.value),
        backgroundColor: ['#F2D7D5', '#F2D7D5', '#A93226', '#D98880', '#D98880'],
      },
      ],
    };
  }

  private navigateToBuyInvoice(monthParam: string) {
    let firstDate,
      endDate;
    const t = new Date();
    switch (monthParam) {
      case 'Tháng này':
      case 'This month': {
        firstDate = new Date(t.getFullYear(), t.getMonth(), 1).toLocaleDateString('en-US');
        endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0).toLocaleDateString('en-US');
        break;
      }
      case 'Jan': {
        const startDay = new Date(t.getFullYear(), 0, 1);
        const lastDay = new Date(t.getFullYear(), 1, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Feb': {
        const startDay = new Date(t.getFullYear(), 1, 1);
        const lastDay = new Date(t.getFullYear(), 2, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Mar': {
        const startDay = new Date(t.getFullYear(), 2, 1);
        const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Apr': {
        const startDay = new Date(t.getFullYear(), 3, 1);
        const lastDay = new Date(t.getFullYear(), 4, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'May': {
        const startDay = new Date(t.getFullYear(), 4, 1);
        const lastDay = new Date(t.getFullYear(), 5, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Jun': {
        const startDay = new Date(t.getFullYear(), 5, 1);
        const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Jul': {
        const startDay = new Date(t.getFullYear(), 6, 1);
        const lastDay = new Date(t.getFullYear(), 7, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Aug': {
        const startDay = new Date(t.getFullYear(), 7, 1);
        const lastDay = new Date(t.getFullYear(), 8, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Sep': {
        const startDay = new Date(t.getFullYear(), 8, 1);
        const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Oct': {
        const startDay = new Date(t.getFullYear(), 9, 1);
        const lastDay = new Date(t.getFullYear(), 10, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Nov': {
        const startDay = new Date(t.getFullYear(), 10, 1);
        const lastDay = new Date(t.getFullYear(), 11, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Dec': {
        const startDay = new Date(t.getFullYear(), 11, 1);
        const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Tuần này':
      case 'This week': {
        const startDay = moment().day(1).toDate();
        const lastDay = moment().day(7).toDate();
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Tuần trước':
      case 'Last week': {
        const startDay = moment().weekday(-6).toDate();
        const lastDay = moment().weekday(0).toDate();
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case 'Tuần sau':
      case 'Next week': {
        const startDay = moment().weekday(8).toDate();
        const lastDay = moment().weekday(14).toDate();
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case '2 tuần trước':
      case '2 weeks ago': {
        const startDay = moment().weekday(-13).toDate();
        const lastDay = moment().weekday(-7).toDate();
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
      case '2 tuần sau':
      case '2 weeks later': {
        const startDay = moment().weekday(15).toDate();
        const lastDay = moment().weekday(21).toDate();
        firstDate = startDay.toLocaleDateString('en-US');
        endDate = lastDay.toLocaleDateString('en-US');
        break;
      }
    }
    const genledSearch = {
      startDate: firstDate,
      endDate: endDate,
      keyword: '',
      isIssueDate: false,
      getDebtOnly : true,
    };

    this.datarequest.sendApplySearchBuyIv(genledSearch);
    this.router.navigate([`/pages/buyinvoice`]);


  }

  private getOption() {
    let isChartInit = true;
    const send = this;

    /**
     * Show data on top of bar chart
     * @param chartReference ,
     */
    function displayDatasetCallback(chartReference) {
      const chartInstance = chartReference.chart,
        ctx = chartReference.chart.ctx;
      ctx.font = '0.6em Montserrat';
      ctx.fillStyle = '#212529';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      chartReference.data.datasets.forEach(function (dataset, i) {
        const meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
          const data = thousandSuffix(dataset.data[index]);
          ctx.fillText(data, bar._model.x, bar._model.y - 1);
        });
      });
    }

    function isDatasetEqualToZero(): boolean {

      if (send.data) {
        const dataset: number[] =  send.data.chart.datasets.map(item1 => item1.data).reduce((a, b) => a.concat(b), []);

        for (let i = 0; i < dataset.length; i++) {
          if (dataset[i] !== 0)
            return false;
        }

        return true;
      }
    }

    return {
      onClick() {
        send.navigateToBuyInvoice(this.active[0]._view.label);
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
      hover: {
        onHover: function (e, element) {
          const point = this.getElementAtEvent(e);
          if (point.length) e.target.style.cursor = 'pointer';
          else e.target.style.cursor = 'default';
        },
      },
      tooltips: {
        intersect: false,
        callbacks: {
          label: function (tooltipItems, data) {
            return thousandSuffix(tooltipItems.yLabel);
          },
        },
        custom: function (tooltipModel) {
          const elementId = 'dashboard__purchase-chart_tooltip';
          // Tooltip Element
          let tooltipEl = document.getElementById(elementId);

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = send.renderer.createElement('div');
            tooltipEl.id = elementId;
            send.renderer.appendChild(send.el.nativeElement, tooltipEl);
          }

          tooltipEl.onclick = () => {
            send.navigateToBuyInvoice(this._active[0]._view.label);
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
          top: 20,
          bottom: 0,
        },
      },
      events: ['mousemove', 'click'],
      animation: {
        easing: 'easeOutCirc',
        onComplete: function () {
          if (isChartInit && !isDatasetEqualToZero()) {
              const chartReference = this;
              displayDatasetCallback(chartReference);
              isChartInit = false;
          }
        },
        onProgress: function () {
          const chartReference = this;
          if (!isDatasetEqualToZero()) {
            displayDatasetCallback(chartReference);
          }
        },
      },
    };
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
    this.data.chart.labels =  this.rawLabels.map(label => translatedLabels[label]) ;
    // refresh chart
    this.data.chart = {...this.data.chart};
  }

  private loadChart(data) {
    this.data = data;
    this.data.chart = this.chartObjectMapping(data.chart);
    this.rawLabels = this.data.chart.labels;
    this.translateLabels();
  }
}
