// Nossas funções Helpersiliares
const utils = require('./utils');
const Estimador = require('./estimador');

module.exports = {
    run: (inputs) => {

        // media taxa de atendimento -> X_= 1
        const mi = 1;
        // taxa_chegada ->  rho = lambda*X_ -> lambda = rho
        const lambda = inputs.rho;
        // # rodadas
        const nrodadas = inputs.rodadas;
        // disciplina de atendimento
        const disciplina = inputs.disciplina;
        // tempo atual de simulação
        let tempoSimulacao = 0;
        // array de chegadas
        let eventos = [];
        // array de rodadas
        let rodadas = [];
        let r = 0;
        // tempo maximo de simulacao
        const tempoMax = 100;

        tempoChegada = utils.getRandomExp(lambda);
        tempoAtendimento = utils.getRandomExp(mi);
        tempoSimulacao = tempoChegada;

        // chegada primeira pessoa
        eventos.push({
            'chegada': tempoChegada,
            'saida': tempoChegada + tempoAtendimento
        });

        for (let i = 0; i < nrodadas; i++) {
            const estX = new Estimador();
            const estW = new Estimador();
            const estT = new Estimador();

            while (true) {
                tempoChegada = utils.getRandomExp(lambda);
                tempoAtendimento = utils.getRandomExp(mi);

                momentoChegada = tempoChegada + tempoSimulacao;
                if (momentoChegada > tempoMax)
                    break;

                let momentoSaida;
                let ultimoASair = eventos[eventos.length - 1].saida;
                if (ultimoASair > momentoChegada) {
                    momentoSaida = ultimoASair + tempoAtendimento
                } else {
                    momentoSaida = momentoChegada + tempoAtendimento
                }

                estX.acontece(tempoAtendimento);
                if ((momentoSaida - (momentoChegada + tempoAtendimento)) <= 0)
                    estW.acontece(0);
                else
                    estW.acontece(momentoSaida - momentoChegada - tempoAtendimento);
                estT.acontece(momentoSaida - momentoChegada);
                tempoSimulacao += tempoChegada;
            }
            rodadas.push({
                'metricas': {
                    'rodada': ++r,
                    'X_': estX.calculaMedia(),
                    'Nq_': '2do',
                    'W_': estW.calculaMedia(),
                    'T_': estT.calculaMedia(),
                    'Var[X]': estX.calculaVariancia(),
                    'Var[Nq]': '2do',
                    'Var[W]': estW.calculaVariancia(),
                    'Var[T]': estT.calculaVariancia()
                },
                'eventos': eventos,

            })
            tempoSimulacao = 0;

        }

        return rodadas;
    }
}