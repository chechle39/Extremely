import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { thousandSuffix, convertRemToPixels } from '../../../shared/utils/util';
import { NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import * as _ from 'lodash';
import { DashboardService } from '../../_shared/services/dashboard.service';
import { DashboardRequest, SaleInvoiceReportView } from '../../_shared/models/dashboard/dashboard.model';

@Component({
  selector: 'xb-sales-figures',
  templateUrl: './sales-figures.component.html',
  styleUrls: ['./sales-figures.component.scss',
],
})
export class SalesFiguresComponent implements OnInit, OnChanges {
  @Input() data: SaleInvoiceReportView;
  options: any;

  constructor(
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private dashboardService: DashboardService,
  ) {
    this.options = this.getOption();

    this.rerenderOnBreakpointChange();
  }

  ngOnInit() {
  }

  ngOnChanges(){
    if (this.data){
      this.data.chart = this.chartObjectMapping(this.data.chart);
    }
  }

  showByMonth() {
    const param = new DashboardRequest();
    param.interval = 'month';
    this.dashboardService.getSaleInvoiceReport(param).subscribe((data: SaleInvoiceReportView) => {
      this.data = data;
      this.data.chart = this.chartObjectMapping(data.chart);
    });
  }

  showByQuater() {
    const param = new DashboardRequest();
    param.interval = 'quater';
    this.dashboardService.getSaleInvoiceReport(param).subscribe((data: SaleInvoiceReportView) => {
      this.data = data;
      this.data.chart = this.chartObjectMapping(data.chart);
    });
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
        intersect: false,
        backgroundColor: '#000000FF',
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
