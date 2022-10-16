// Dataset for line chart
interface LineChartDatasetProps {
  label: string;
  data: { x: number; y: number }[];
  xAxisID?: string;
  backgroundColor?: string;
  borderColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  borderDash?: number[];
}
const LineChartData = ({
  label,
  data,
  xAxisID,
  backgroundColor,
  borderColor,
  pointBorderColor,
  pointHoverBackgroundColor,
  borderDash
}: LineChartDatasetProps) => {
  return {
    label: label,
    fill: false,
    lineTension: 0.3, // The more the value is, the more the curve is.
    // cubicInterpolationMode: 'monotone', // default or monotone
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    // borderCapStyle: 'butt',
    borderDash: borderDash,
    // borderDashOffset: 0.0,
    // borderJoinStyle: 'miter',
    pointBorderColor: pointBorderColor,
    pointBackgroundColor: '#fff',
    pointBorderWidth: 2, // Pixels.
    pointHoverRadius: 5,
    pointHoverBackgroundColor: pointHoverBackgroundColor,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 5,
    // pointHitRadius: 10,
    data: data,
    xAxisID: xAxisID
    // yAxisID: 'y1' // If you want to use a different y-axis, uncomment this line.
  };
};
// Options for line chart
interface LineChartOptionsProps {
  chartTitle?: string; // Chart title name
  y1Title: string; // y1 axis title name
  x1SuggestedMin?: number; // milliseconds. Math.min(dataMin, suggestedMin)
  x1SuggestedMax?: number; // milliseconds. Math.max(dataMax, suggestedMax)
  x2SuggestedMin?: number; // milliseconds. Math.min(dataMin, suggestedMin)
  x2SuggestedMax?: number; // milliseconds. Math.max(dataMax, suggestedMax)
}
const LineChartOptions = ({
  chartTitle = '',
  y1Title,
  x1SuggestedMin,
  x1SuggestedMax,
  x2SuggestedMin,
  x2SuggestedMax
}: LineChartOptionsProps) => {
  return {
    maintainAspectRatio: false,
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        labels: {
          // https://www.chartjs.org/docs/latest/general/fonts.html
          font: {
            size: 18 // Default is 12px.
          }
        },
        position: 'top' as const // 'top', 'bottom', 'left', 'right'
      },
      title: {
        display: false, // true, false
        text: chartTitle // string
      }
    },
    // https://www.chartjs.org/docs/latest/axes/
    // https://www.chartjs.org/docs/latest/axes/cartesian/time.html#configuration-options
    scales: {
      x1: {
        display: true, // true, false
        type: 'time' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        time: {
          unit: 'day' as const, // 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#time-units
          // parser: 'x', // means Unix Timestamp without milliseconds. https://www.chartjs.org/docs/latest/axes/cartesian/time.html#parsing-callbacks
          // round: false, // If it's true, dates will be rounded to the start of this unit.
          // stepSize: 1, // The number of units between grid lines.
          displayFormats: {
            day: 'MMM D, YY' // https://momentjs.com/docs/#/displaying/format/
          },
          tooltipFormat: 'llll' // Tue, Oct 11, 2022 2:52 PM. https://momentjs.com/
        },
        suggestedMin: x1SuggestedMin,
        suggestedMax: x1SuggestedMax,
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
      },
      x2: {
        display: false, // Do not show x2 axis.
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM D, YY'
          },
          tooltipFormat: 'llll'
        },
        suggestedMin: x2SuggestedMin,
        suggestedMax: x2SuggestedMax,
        ticks: {
          font: {
            size: 18
          }
        }
      },
      y: {
        display: true, // true, false
        type: 'linear' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
        position: 'left' as const, // 'left', 'right'
        title: {
          display: true, // true, false
          text: y1Title,
          font: {
            size: 18 // Default is 12px.
          }
        },
        suggestedMin: 0, // Minimum value to display on the y-axis
        ticks: {
          font: {
            size: 18 // Default is 12px.
          }
        }
      }
      // y2: {
      //   display: true, // true, false
      //   type: 'linear' as const, // 'linear', 'logarithmic', 'time', 'category', 'timeseries'
      //   position: 'left' as const, // 'left', 'right'
      //   title: {
      //     display: false // true, false
      //   },
      //   suggestedMin: 0, // Minimum value to display on the y-axis
      //   ticks: {
      //     font: {
      //       size: 18 // Default is 12px.
      //     }
      //   }
      //   grid: {
      //     drawOnChartArea: false // false, true
      //   }
      // }
    }
  };
};

export { LineChartData, LineChartOptions };
