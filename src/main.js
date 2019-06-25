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
    interface.clearTable('metricas-table');
    const inputs = interface.getInputValues();
    let stats = acontece.run(inputs);
    for (let i = 0; i < stats.perRound.length; i++) {
        const s = stats.perRound[i];
        // ordem tabela html: (avg e var)(x, w, t, nq)
        let statsValues = [s.round, s.X.avg, s.X.var, s.W.avg, s.W.var, s.T.avg, s.T.var, s.Nq.avg, s.Nq.var];
        interface.addTableRow('metricas-table', statsValues);
    }

}