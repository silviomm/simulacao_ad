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
    let stats = acontece.run(interface.getInputValues());
    interface.fillICTable(stats);
    interface.fillMetricasTable(stats);
}