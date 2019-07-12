const LCFSQueue = require('../Queues/lcfs');
const FCFSQueue = require('../Queues/fcfs');

const StatsCollector = require('../Statistics/stats-collector');

const Server = require('./server');
const ArrivalGenerator = require('./arrival-generator');

const utils = require('../Helpers/utils');

function queueToServer(time, queue, server) {
    let elt = queue.get();
    server.enter(time, elt);
}

function arrivalToQueue(time, queue, round) {
    queue.put({
        round: round,
        arrivalTime: time
    });
}

function exitServer(server) {
    return server.exit();
}

function calcNumberOfPoints(numFregueses, numRodadas) {
    let numPontos = 200;
    if (numFregueses * numRodadas <= numPontos)
        numPontos = numFregueses * numRodadas;
    let intervalo = parseInt((numFregueses * numRodadas) / numPontos, 10);
    numPontos = parseInt((numFregueses * numRodadas) / intervalo, 10);
    return {
        'totalFreguesesGrafico': numFregueses * numRodadas + 1,
        'intervalo': intervalo,
        'numPontos': numPontos
    };
}

function timeToCollect(departuresTotal, intervalo, totalFreguesesGrafico) {
    return (((departuresTotal + 1) % intervalo === 0) && ((departuresTotal + 1) <= (totalFreguesesGrafico)));
}

function colectData(stats, currentTime, wIter, nqIter) {
    wIter.push(stats.rrW.getAverage().toFixed(5));
    nqIter.push(stats.rrNq.getAverage(currentTime).toFixed(5));
}

// elemento: arrivalTime, entryTime, exitTime

module.exports = {
    run: (inputs) => {
        // Inicia com os valores de input
        const numRodadas = inputs.rodadas;
        let numFregueses = inputs.fregueses;
        const numTransiente = inputs.transiente;
        const nrodadas = inputs.rodadas;


        // Determina quantos pontos serão plotados nos gráficos
        let calc = calcNumberOfPoints(numFregueses, numRodadas);

        let nqIter = [];
        let wIter = [];
        let nqTrans = [];
        let wTrans = [];
        let queue = inputs.disciplina === 'FCFS' ? new FCFSQueue() : new LCFSQueue();

        // server exponencial
        let generator = new ArrivalGenerator(inputs.rho);
        let server = new Server(1);

        // server deterministico
        // let generator = new ArrivalGenerator(inputs.rho, utils.getDeterministic);
        // let server = new Server(1, utils.alternate([1.5, 0.1]));

        let stats = new StatsCollector();
        let currentTime = 0;
        let departuresTotal = 0;

        let nextArrival = generator.getNext();

        for (let i = -1; i < nrodadas; i++) {

            if (i == -1) {
                if(numTransiente == "") {
                    if (inputs.rho <= 0.7) {
                        // 50000 para cada 0.1 de rho
                        numFregueses = 1000000 * inputs.rho;
                    } else {
                        // +25% por 0.1 acima de 0.6
                        let fatorAumento = (inputs.rho - 0.6) * 5;
                        // +50% para 0.8, +100% para 0.9
                        //let fatorAumento = 0.25 * Math.pow(2, 10 * (inputs.rho - 0.7));
                        numFregueses = 500000 * inputs.rho * (1 + fatorAumento);
                    }
                }
                else {
                    numFregueses = numTransiente;
                }
                console.log("transient: ", numFregueses)
            }

            if (i == 0) {
                console.log('total pos trans', departuresTotal);
                numFregueses = inputs.fregueses;
            }

            let arrivals = 0;
            let departures = 0;

            let queueHead = queue.peek();
            let serverState = server.getState();

            //while (arrivals < 5000) {
            while (departures < numFregueses) {
                if (serverState.status == 'empty') {
                    if (queueHead) { // se servidor esta vazio, e ha alguem na fila
                        //console.log("fila pro servidor", currentTime);
                        let nq = queue.length();
                        queueToServer(currentTime, queue, server);

                        stats.updateQueue(currentTime, nq);

                        queueHead = queue.peek();
                        serverState = server.getState();
                    } else { // servidor e fila vazios
                        //console.log("chegada pra fila - server e fila vazios", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue, i);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    }
                } else { // servidor ocupado
                    if (nextArrival <= serverState.exitTime) {
                        //console.log("chegada pra fila - server ocupado", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue, i);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    } else {
                        //console.log("saida do servidor", serverState.exitTime);
                        let nq = queue.length();
                        let elt = exitServer(server);

                        currentTime = serverState.exitTime;

                        stats.fromElement(elt, i);
                        stats.updateQueue(currentTime, nq);

                        serverState = server.getState();

                        departures += 1;

                        departuresTotal += 1;

                        if (timeToCollect(departuresTotal, calc.intervalo, calc.totalFreguesesGrafico)) {
                            if (i != -1) {
                                colectData(stats, currentTime, wIter, nqIter);
                            } else {
                                colectData(stats, currentTime, wTrans, nqTrans);
                            }
                            // colectData(stats, currentTime, wIter, nqIter);
                        }
                    }
                }
            }
            // console.log("arrivals", arrivals);
            // console.log("departures", departures);

            stats.nextRound(currentTime);
        }

        let resultado = {
            'stats': stats,
            'nqIter': nqIter,
            'wIter': wIter,
            nqTrans: nqTrans,
            wTrans: wTrans,
            'numPontos': calc.numPontos,
            'totalId': calc.numPontos * calc.intervalo
        };

        return resultado;
    }
};
