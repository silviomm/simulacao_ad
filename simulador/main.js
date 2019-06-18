const utils = require('./utils');
const interface = require('./interface');


// taxa_chegada
const lamb = 0.5;
// taxa_atendimento
const mu = 0.2;
// # rodadas
const QNTD_RODADAS = 100;
// tempo atual de simulação
let tempoSimulacao = 0;
// array de chegadas
let pessoas = [];
// tempo maximo de simulacao
const tempoMax = 100;

    tempoChegada = utils.getRandomExp(lamb);
    tempoAtendimento = utils.getRandomExp(mu);
    tempoSimulacao = tempoChegada;
    
    // chegada primeira pessoa
    pessoas.push({'chegada': tempoChegada, 'saida': tempoChegada+tempoAtendimento});

while(true) {
    tempoChegada = utils.getRandomExp(lamb);
    tempoAtendimento = utils.getRandomExp(mu);

    momentoChegada = tempoChegada + tempoSimulacao;
    if(momentoChegada > tempoMax)
        break;
    
    let momentoSaida;
    let ultimoASair = pessoas[pessoas.length-1].saida;
    if(ultimoASair > momentoChegada)
        momentoSaida = ultimoASair + tempoAtendimento
    else
        momentoSaida = momentoChegada + tempoAtendimento
    
    pessoas.push({'chegada': momentoChegada, 'saida': momentoSaida});
    tempoSimulacao += tempoChegada;
}

for (let i = 0; i < pessoas.length; i++) {
    const element = pessoas[i];
    interface.addLineToTable('metricas-table', element); 
}