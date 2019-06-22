// Nossas funções auxiliares
const utils = require('./utils');

module.exports = {
    run: (inputs) => {

        // media taxa de atendimento -> X_= 1
        const mi = 1;
        // taxa_chegada ->  rho = lambda*X_ -> lambda = rho
        const lambda = inputs.rho;
        // # rodadas
        const rodadas = inputs.rodadas;
        // disciplina de atendimento
        const disciplina = inputs.disciplina;
        // tempo atual de simulação
        let tempoSimulacao = 0;
        // array de chegadas
        let eventos = [];
        // tempo maximo de simulacao
        const tempoMax = 100;

        tempoChegada = utils.getRandomExp(lambda);
        tempoAtendimento = utils.getRandomExp(mi);
        tempoSimulacao = tempoChegada;

        // chegada primeira pessoa
        eventos.push({
            'rodada': 0,
            'chegada': tempoChegada,
            'saida': tempoChegada + tempoAtendimento
        });

        for (let i = 0; i < rodadas; i++) {
            while (true) {
                tempoChegada = utils.getRandomExp(lambda);
                tempoAtendimento = utils.getRandomExp(mi);

                momentoChegada = tempoChegada + tempoSimulacao;
                if (momentoChegada > tempoMax)
                    break;

                let momentoSaida;
                let ultimoASair = eventos[eventos.length - 1].saida;
                if (ultimoASair > momentoChegada)
                    momentoSaida = ultimoASair + tempoAtendimento
                else
                    momentoSaida = momentoChegada + tempoAtendimento

                eventos.push({
                    'rodada': i,
                    'chegada': momentoChegada,
                    'saida': momentoSaida
                });
                tempoSimulacao += tempoChegada;
            }
            tempoSimulacao = 0;
        }

        return eventos;
    }
}