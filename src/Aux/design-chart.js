module.exports = {
    red_dataset: {
        label: "",
        lineTension: 0.3,
        backgroundColor: "rgba(236, 100, 75, 0.05)",
        borderColor: "rgba(236, 100, 75, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(236, 100, 75, 1)",
        pointBorderColor: "rgba(236, 100, 75, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "yellow",
        pointHitRadius: 10,
        pointBorderWidth: 1,
        data: null,
    },
    blue_dataset: {
        label: "",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "yellow",
        pointHitRadius: 10,
        pointBorderWidth: 1,
        data: null,
    },
    chartOptions: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                    // Include a dollar sign in the ticks
                    // callback: (value, index, values) => {
                    //     return '$' + this.number_format(value);
                    // }
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
                title: () => {
                    return 'Nq : #Fregueses'
                },
                label: (tooltipItem, chart) => {
                    return tooltipItem.yLabel + ' : ' + tooltipItem.xLabel;
                }
            }
        }
    }
}