/* 
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./interface');

// Lógica principal do simulador
const acontece = require('./simulador');

// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {
    executa();
});

function executa() {
    let result = acontece.run(interface.getInputValues());

    // tabelas
    interface.fillICTable(result.stats);
    interface.fillMetricasTable(result.stats);

    // graficos
    trataDados(result.totalId, result.nqIter, result.numPontos);

}

function trataDados(totalId, nqIter, numPontos){

    

    // nq = rodadas.map(r => r.metricas['Nq_'])

    // nq = rodadas.map(r => r.metricas['NqIter'])

    console.log(totalId);
    console.log(nqIter);
    console.log(numPontos);

    geraGrafico(totalId,nqIter, numPontos, '#chartNq1')

//     nq = rodadas.map(r => r.metricas['Nq_'])
//     console.log(nq)
//     var data = {
    
//         // labels: 
//         // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

//         series: 
//         [nq]
//     };

// // Create a new line chart object where as first parameter we pass in a selector
// // that is resolving to our chart container element. The Second parameter
// // is the actual data object.
// new Chartist.Line('.ct-chart', data);
}

function geraGrafico(nTotal, dataPerTime, nPoints, chartId){

    let labelArray = [];
    //let interval = parseInt(nTotal / nPoints, 10); // De quantos em quantos clientes os dados foram coletados
    let interval = nTotal / nPoints;

    for (let i = 0; i < nPoints; i++) {
        labelArray[i] = i*interval;
    }

    let labelQuantity = parseInt(nPoints / 10, 10);


    const dataRhoChart = {
            labels: labelArray,
            series: [dataPerTime], 
    };

    const optionsRhoChart = {
        
        axisX: {
            labelInterpolationFnc: function skipLabels(value, index) {
                return ((index) % labelQuantity) === 0 ? (value) : null;
            }
        },
        axisY: {
            low: 0,
        },
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        height: 200,
        chartPadding: { top: 30, right: 5, bottom: 0, left: 0},
        showPoint: false,
    };

    let rhoChart = new Chartist.Line(chartId, dataRhoChart, optionsRhoChart);
}
