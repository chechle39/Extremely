import { Component, OnInit } from '@angular/core';
import { thousandSuffix } from '../../../shared/utils/util';
@Component({
  selector: 'xb-purchase-chart',
  templateUrl: './purchase-chart.component.html',
  styleUrls: ['./purchase-chart.component.scss'],
})
export class PurchaseChartComponent implements OnInit {
  data: any;
  options: any;

  constructor() { }

  ngOnInit() {
    this.showByMonth();

    this.options = this.getOption();
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
      events: ['mousemove'],
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
