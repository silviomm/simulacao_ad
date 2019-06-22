/* 
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./interface');

// Lógica principal do simulador
const simulador = require('./simulador');

// Adiciona evento de 'click' no botão de play.
document.getElementById('run-button').addEventListener('click', () => {
    const inputs = interface.getInputValues();
    let eventos = simulador.run(inputs);
    for (let i = 0; i < eventos.length; i++) {
        const element = eventos[i];
    
        // apenas para preencher a tabela enqnt nao calcula realmente
        element['a'] = 2.23534
        element['b'] = 2.23534
        element['c'] = 2.23534
        element['d'] = 2.23534
        element['e'] = 2.23534
        element['f'] = 2.23534
    
        interface.addTableRow('metricas-table', element);
    }
    interface.clearTable('metricas-table');
});