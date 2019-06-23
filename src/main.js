/* 
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./interface');

// Lógica principal do simulador
const fcfs = require('./fcfs');

// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {
    executa();
    
});

function executa(){
    setTimeout(function(){
        interface.clearTable('metricas-table');
    const inputs = interface.getInputValues();
    let rodadas = fcfs.run(inputs);
    for (let i = 0; i < rodadas.length; i++) {
        const r = rodadas[i];
        interface.addTableRow('metricas-table', r.metricas);
    }
    }, 50)
}

function modal(){
    $('.modal').modal('show');
    $('.modal').modal('hide');
  
 }