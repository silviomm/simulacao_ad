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
    
    // graficos
    interface.geraGrafico(result.totalId, result.nqIter, result.numPontos, '#chartNq1');
    interface.createChart(result.totalId, result.nqIter, result.numPontos, '#chartNq1');

});