/*
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./Helpers/interface');

// Lógica principal do simulador
const simulator = require('./Simulator/simulator');

// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {

    let startTime = new Date().getTime();
    let result = simulator.run(interface.getInputValues());
    let input = interface.getInputValues();
    let numeroRodadas = input.rodadas;
    let endTime = new Date().getTime();

    console.log('tempo simulacao: ', (endTime - startTime) / 1000);
    startTime = new Date().getTime();

    // Preenche tabela de IC
    interface.clearTable('ic-table');
    interface.fillICTable(result.stats);
    console.log(result.stats);
    // Preenche tabela de métricas
    interface.clearTable('metricas-table');
    interface.fillMetricasTable(result.stats, numeroRodadas);

    interface.addTableRow('metricas-table', {
        'rodada': `<b>MÉDIA</b>`,
        'X': `<b>${result.stats.X.getAverage().toFixed(5)}</b>`,
        'vX': `<b>${result.stats.vX.getAverage().toFixed(5)}</b>`,
        'W': `<b>${result.stats.W.getAverage().toFixed(5)}</b>`,
        'vW': `<b>${result.stats.vW.getAverage().toFixed(5)}</b>`,
        'T': `<b>${result.stats.T.getAverage().toFixed(5)}</b>`,
        'vT': `<b>${result.stats.vT.getAverage().toFixed(5)}</b>`,
        'Nq': `<b>${result.stats.Nq.getAverage().toFixed(5)}</b>`,
        'vNq': `<b>${result.stats.vNq.getAverage().toFixed(5)}</b>`,
    });
    
    // graficos
    // grafico do artine antigo: interface.geraGrafico(result.totalId, result.nqIter, result.numPontos, '#chartNq1');
    interface.createLineChart(result.totalId, result.nqIter, result.numPontos, 'chart-1', 'chart-area-1');
    interface.createLineChart(result.totalId, result.wIter, result.numPontos, 'chart-2', 'chart-area-2');

    endTime = new Date().getTime();

    console.log('tempo renderização: ', (endTime - startTime) / 1000);



})
