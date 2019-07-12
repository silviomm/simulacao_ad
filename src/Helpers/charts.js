const designChart = require('./design-chart');

//Classe responsavel por criar as linhas utilizadas nos gráficos
class Charts {

    static createLineChart(labels, series, chartId, tooltipTitle) {

        // definindo parte transiente do grafico
        const transient = designChart.red_dataset;
        transient.data = series.transient;
        transient.label = 'transient';

        // definindo parte não transiente do grafico
        const normal = designChart.blue_dataset;
        normal.data = series.normal;
        normal.label = 'normal';

        const datasets = [transient, normal]

        let options = designChart.chartOptions;
        options.tooltips.callbacks.title = () => {return tooltipTitle};

        var ctx = document.getElementById(chartId);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: options
        });
    }
}

module.exports = Charts;