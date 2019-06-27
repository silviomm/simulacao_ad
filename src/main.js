/* 
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./Aux/interface');

// Lógica principal do simulador
const simulator = require('./Simulator/simulator');


// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {
    
    let result = simulator.run(interface.getInputValues());
    
    // tabelas
    interface.fillICTable(result.stats);
    interface.fillMetricasTable(result.stats);
    interface.addTableRow('metricas-table', {
        'rodada': result.stats.round,
        'X': result.stats.X.getAverage().toFixed(5),
        'vX': result.stats.vX.getAverage().toFixed(5),
        'W': result.stats.W.getAverage().toFixed(5),
        'vW': result.stats.vW.getAverage().toFixed(5),
        'T': result.stats.T.getAverage().toFixed(5),
        'vT': result.stats.vT.getAverage().toFixed(5),
        'Nq': result.stats.Nq.getAverage().toFixed(5),
        'vNq': result.stats.vNq.getAverage().toFixed(5),
    })
    
    // graficos
    // interface.geraGrafico(result.totalId, result.nqIter, result.numPontos, '#chartNq1');
    interface.createLineChart(result.totalId, result.nqIter, result.numPontos, 'chart-1', 'chart-area-1');
    interface.createLineChart(result.totalId, result.wIter, result.numPontos, 'chart-2', 'chart-area-2');
    
});