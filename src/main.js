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

function exibeModal() {

    //Promise feita para aguardar a exibição do modal
    //de carregamento antes de executar a lógica do simulador
    return new Promise(function (resolve, reject) {

        document.getElementById('loader').style.display = "block";
        setTimeout(function(){ resolve()}, 100);
    });
}

// Adiciona evento de 'click' no botão de play e executa o simulador.
document.getElementById('run-button').addEventListener('click', () => {
    

    
    exibeModal().then(function(){

        //Pega momento de início de simulação
        let startTime = new Date().getTime();

        //Guarda os resultados da simulação na variável result
        let result = simulator.run(interface.getInputValues());

        //Pega o número de rodadas e guarda para exibição de tabelas
        let input = interface.getInputValues();
        let numeroRodadas = input.rodadas;

        //Pega o momento de finalização de simulação
        let endTime = new Date().getTime();

        //Exibe tempo de simulação
        console.log('tempo simulacao: ', (endTime - startTime) / 1000);

        //Pega momento de início de geração de tabelas com resultados
        startTime = new Date().getTime();

        // Preenche tabela de IC
        interface.clearTable('ic-table');
        interface.fillICTable(result.stats);
        // Preenche tabela de métricas
        interface.clearTable('metricas-table');
        //Adiciona uma primeira linha contendo a média das métricas calculadas
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
        interface.fillMetricasTable(result.stats, numeroRodadas);


        //Chamada de funções para exibição de gráficos
        interface.createLineChart(result.totalId, result.nqIter, result.numPontos, 'chart-1', 'chart-area-1', 'Nq : #Fregueses');
        interface.createLineChart(result.totalId, result.wIter, result.numPontos, 'chart-2', 'chart-area-2', 'W : #Fregueses');

        //Pega o momento de finalização de exibição de métricas
        endTime = new Date().getTime();

        console.log('tempo renderização: ', (endTime - startTime) / 1000);

        //Desliga o loader
        document.getElementById('loader').style.display = "none";
    })
   
})
