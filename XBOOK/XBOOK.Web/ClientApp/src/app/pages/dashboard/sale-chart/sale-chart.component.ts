import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xb-sale-chart',
  templateUrl: './sale-chart.component.html',
  styleUrls: ['./sale-chart.component.scss'],
})
export class SaleChartComponent implements OnInit {
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

  private getOption() {
    let isChartInit = true;

    /**
     * Show data on top of bar chart
     * @param chartReference ,
     */
    function displayDatasetCallback(chartReference) {
      const chartInstance = chartReference.chart,
        ctx = chartReference.chart.ctx;
      ctx.font = '1rem Montserrat';
      ctx.fillStyle = '#212529';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      chartReference.data.datasets.forEach(function (dataset, i) {
        const meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
          const data = dataset.data[index];
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
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
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
