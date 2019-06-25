const designChart = require('./design-chart');

class Charts {

    static createLineChart(labels, series, chartId) {

        // definindo parte transient do grafico
        const transient = designChart.red_dataset;
        transient.data = series.transient;
        transient.label = 'transient';

        // definindo parte "normal" do grafico
        const normal = designChart.blue_dataset;
        normal.data = series.normal;
        normal.label = 'normal';

        const datasets = [transient, normal]

        var ctx = document.getElementById(chartId);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: designChart.chartOptions
        });
    }
}

module.exports = Charts;