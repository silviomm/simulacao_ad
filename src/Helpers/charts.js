const designChart = require('./design-chart');

//Classe responsavel por criar as linhas utilizadas nos gráficos
class Charts {

    static createLineChart(labels, series, chartId) {

        // definindo parte transiente do grafico
        const transient = designChart.red_dataset;
        transient.data = series.transient;
        transient.label = 'transient';

        // definindo parte não transiente do grafico
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