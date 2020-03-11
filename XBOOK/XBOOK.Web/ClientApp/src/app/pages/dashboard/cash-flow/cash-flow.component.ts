import { Component, OnInit } from '@angular/core';

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
            value: 41,
          },
          {
            label: 'Tiền Chi',
            value: 84,
          },
        ],
      },
      {
        label: 'Feb',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 65,
          },
          {
            label: 'Tiền Chi',
            value: 12,
          },
        ],
      },
      {
        label: 'Mar',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 33,
          },
          {
            label: 'Tiền Chi',
            value: 28,
          },
        ],
      },
      {
        label: 'Apr',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 75,
          },
          {
            label: 'Tiền Chi',
            value: 42,
          },
        ],
      },
      {
        label: 'May',
        datasets: [
          {
            label: 'Tiền Thu',
            value: 4,
          },
          {
            label: 'Tiền Chi',
            value: 55,
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
        const isLegendHidden = chartReference.legend.legendItems[i].hidden;
        if (!isLegendHidden) {
          const meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y - 1);
          });
        }
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
        position: 'top',
        labels: {
          fontColor: 'black',
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
