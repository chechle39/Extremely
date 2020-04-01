import { Component, OnInit } from '@angular/core';
import { thousandSuffix } from '../../../shared/utils/util';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/service/common.service';
import { Router } from '@angular/router';
import { DataService } from '../../_shared/services/data.service';
@Component({
  selector: 'xb-purchase-chart',
  templateUrl: './purchase-chart.component.html',
  styleUrls: ['./purchase-chart.component.scss'],
})
export class PurchaseChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(
    private datarequest: DataService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit() {
    this.showByMonth();

    this.options = this.getOption();
  }
  NewBuyInvoice() {
    this.router.navigate([`pages/buyinvoice/new`]);
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
        value: 23000000000,
      },
      {
        label: 'Mar',
        value: 1200000000,
      },
      {
        label: 'Tháng này',
        value: 4500000000,
      },
      {
        label: 'May',
        value: 800000000,
      },
      {
        label: 'Jun',
        value: 2500000000,
      },
    ];
    this.data = this.chartObjectMapping(data);
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

  private getOption() {
    let isChartInit = true;
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
    const send =  this
    return {
      onClick () {       
        switch (this.active[0]._view.label) {
          case 'Tháng này': {
            var t = new Date();
            this.firstDate = new Date(t.getFullYear(), t.getMonth(), 1).toLocaleDateString('en-US');
            this.endDate = new Date(t.getFullYear(), t.getMonth() + 1, 0).toLocaleDateString('en-US');       
            break;
          }
          case 'Jan': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 0, 1);
            const lastDay = new Date(t.getFullYear(), 1, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
           
            break;
          }
          case 'Feb': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 1, 1);
            const lastDay = new Date(t.getFullYear(), 2, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
           
            break;
          }
          case 'Mar': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 2, 1);
            const lastDay = new Date(t.getFullYear(), 3, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
          
            break;
          }
          case 'Apr': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 3, 1);
            const lastDay = new Date(t.getFullYear(), 4, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
           
            break;
          }
          case 'May': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 4, 1);
            const lastDay = new Date(t.getFullYear(), 5, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            
            break;
          }
          case 'Jun': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 5, 1);
            const lastDay = new Date(t.getFullYear(), 6, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
          
            break;
          }
          case 'Jul': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 6, 1);
            const lastDay = new Date(t.getFullYear(), 7, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
           
            break;
          }
          case 'Aug': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 7, 1);
            const lastDay = new Date(t.getFullYear(), 8, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            
            break;
          }
          case 'Sep': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 8, 1);
            const lastDay = new Date(t.getFullYear(), 9, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
           
            break;
          }
          case 'Oct': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 9, 1);
            const lastDay = new Date(t.getFullYear(), 10, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
          
            break;
          }
          case 'Nov': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 10, 1);
            const lastDay = new Date(t.getFullYear(), 11, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            
            break;
          }
          case 'Dec': {
            var t = new Date();
            const startDay = new Date(t.getFullYear(), 11, 1);
            const lastDay = new Date(t.getFullYear(), 12, 0, 23, 59, 59);
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            
            break;
          }
          case 'Tuần này': {    
            const startDay = moment().day(1).toDate();
            const lastDay = moment().day(7).toDate();
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            break;
          }
          case 'Tuần trước': {
            const startDay = moment().weekday(-6).toDate();
            const lastDay = moment().weekday(0).toDate();
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            break;
          }
          case 'Tuần sau': {
            const startDay = moment().weekday(8).toDate();
            const lastDay = moment().weekday(14).toDate();
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            break;
          }
          case '2 Tuần trước': {
            const startDay = moment().weekday(-13).toDate();
            const lastDay = moment().weekday(-7).toDate();
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            break;
          }
          case '2 Tuần sau': {
            const startDay = moment().weekday(15).toDate();
            const lastDay = moment().weekday(21).toDate();
            this.firstDate = startDay.toLocaleDateString('en-US');
            this.endDate = lastDay.toLocaleDateString('en-US');
            break;
          }
        }
        console.log(1)
        console.log(this.active[0]._view.label)
        const genledSearch = {
          startDate: this.firstDate,
          endDate: this.endDate,          
        };
        console.log(genledSearch);
        send.datarequest.sendMessagebuyInvoice(genledSearch);
        send.router.navigate([`pages/buyinvoice`]);           
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
          top: 20,
          bottom: 0,
        },
      },
      events: ['mousemove','click'],
      animation: {
        easing: 'easeOutCirc',
        onComplete: function () {
          if (isChartInit) {
            const chartReference = this;
            displayDatasetCallback(chartReference);
            isChartInit = false;
          }
        },
        onProgress: function () {
          const chartReference = this;
          displayDatasetCallback(chartReference);
        },
      },
    };
  }
}
