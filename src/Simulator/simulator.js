const LCFSQueue = require('../Queues/lcfs');
const FCFSQueue = require('../Queues/fcfs');

const StatsCollector = require('../Statistics/stats-collector');

const Server = require('./server');
const ArrivalGenerator = require('./arrival-generator');

const utils = require('../Aux/utils');

function queueToServer(time, queue, server) {
    let elt = queue.get();
    server.enter(time, elt);
}

function arrivalToQueue(time, queue) {
    queue.put({
        arrivalTime: time
    });
}

function exitServer(server) {
    return server.exit();
}

// elemento: arrivalTime, entryTime, exitTime

module.exports = {
    run: (inputs) => {
        let numRodadas = inputs.rodadas;
        let numFregueses = inputs.fregueses;

        let numPontos = 200;
        if(numFregueses*numRodadas < numPontos)
            numPontos = numFregueses*numRodadas;

        let intervalo = parseInt((numFregueses*numRodadas) / numPontos, 10);

        numPontos = parseInt((numFregueses*numRodadas) / intervalo, 10);

        console.log('init' , numPontos, intervalo, numFregueses);

        const nrodadas = inputs.rodadas;
        let nqIter = [];
        let wIter = [];

        let generator = new ArrivalGenerator(inputs.rho);
        let queue = inputs.disciplina === 'FCFS' ? new FCFSQueue() : new LCFSQueue();
        let server = new Server(1);
        let stats = new StatsCollector();

        let currentTime = 0;

        let departuresTotal = 0;

        for (let i = 0; i < nrodadas; i++) {
            let arrivals = 0;
            let departures = 0;

            let nextArrival = generator.getNext();
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
                        //console.log("chegada pra fila 1", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    }
                } else { // servidor ocupado
                    if (nextArrival <= serverState.exitTime) {
                        //console.log("chegada pra fila 2", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    } else {
                        //console.log("saida do servidor", serverState.exitTime);
                        elt = exitServer(server);

                        currentTime = serverState.exitTime;

                        stats.fromElement(elt);

                        serverState = server.getState();

                        departures += 1;
                        departuresTotal +=1 ;
                        if ((((departuresTotal+1) % intervalo === 0) && ((departuresTotal+1) <= numFregueses * numRodadas))) {
                            wIter.push(stats.rrW.getAverage().toFixed(5));
                            nqIter.push(stats.rrNq.getAverage(currentTime).toFixed(5));
                        }
                    }
                }

            }
            // console.log("arrivals", arrivals);
            // console.log("departures", departures);

            stats.nextRound(currentTime);
        }
        // média das médias
        // console.log(stats.X.getAverage(), stats.W.getAverage(), stats.T.getAverage());

        let resultado = {
            'stats': stats,
            'nqIter': nqIter,
            'wIter': wIter,
            'numPontos': numPontos,
            'totalId': numPontos*intervalo
        };

        return resultado;
    }
}
