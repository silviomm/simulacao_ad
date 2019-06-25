const utils = require('./utils');
const DiscreteEstimator = require('./discrete-estimator');
const ContinuousEstimator = require('./continuous-estimator');

class ArrivalGenerator {
    constructor(rate, time = 0) {
        this.rate = rate;
        this.time = time;
    }

    getNext() {
        this.time += utils.getRandomExp(this.rate);
        return this.time;
    }
}

class LCFSQueue {
    constructor() {
        this.queue = []
    }

    put(elt) {
        return this.queue.push(elt);
    }

    peek() {
        return this.queue[0];
    }

    get() {
        return this.queue.pop();
    }

    length() {
        return this.queue.length;
    }
}

class FCFSQueue {
    constructor() {
        this.queue = [];
    }

    put(elt) {
        return this.queue.unshift(elt);
    }

    peek() {
        return this.queue[this.queue.length - 1];
    }

    get() {
        return this.queue.pop();
    }

    length() {
        return this.queue.length;
    }
}

class ExponentialServer {
    constructor(rate) {
        this.rate = rate;
        this.exitTime = Infinity;
        this.currentElement = null;
    }

    enter(time, elt) {
        elt.entryTime = time;
        elt.exitTime = time + utils.getRandomExp(this.rate);
        this.currentElement = elt;
        this.exitTime = elt.exitTime;
    }

    getState() {
        if (this.currentElement != null) {
            return {
                status: 'full',
                exitTime: this.exitTime,
            };
        } else {
            return {
                status: 'empty'
            };
        }
    }

    getExitTime() {
        return this.exitTime;
    }

    exit() {
        let out = this.currentElement;
        this.currentElement = null;
        this.exitTime = Infinity;

        return out;
    }
}

class Stats {
    constructor() {
        this.resetRoundEstimators(0);

        this.rNq = new ContinuousEstimator();
        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new DiscreteEstimator();
    }

    resetRoundEstimators(time) {
        this.rX = new DiscreteEstimator();
        this.rW = new DiscreteEstimator();
        this.rT = new DiscreteEstimator();
        // this.rNq = new ContinuousEstimator(time);
    }

    fromElement(elt) {
        this.rX.sample(elt.exitTime - elt.entryTime);
        this.rW.sample(elt.entryTime - elt.arrivalTime);
        this.rT.sample(elt.exitTime - elt.arrivalTime);
    }

    updateQueue(time, nq) {
        this.rNq.sample(time, nq);
    }

    nextRound(time) {
        this.X.sample(this.rX.getAverage());
        this.W.sample(this.rW.getAverage());
        this.T.sample(this.rT.getAverage());
        this.Nq.sample(this.rNq.getAverage(time));

        this.resetRoundEstimators(time);
    }
}

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
        let foo = 0;
        let cont = 0;
        let numRodadas = inputs.rodadas;
        let numFregueses = 5000;
    
    
        let numPontos = 200;
        if(numFregueses*numRodadas < numPontos)
            numPontos = numFregueses*numRodadas;
    
        let intervalo = parseInt((numFregueses*numRodadas) / numPontos, 10);
    
        numPontos = parseInt((numFregueses*numRodadas) / intervalo, 10);

        console.log('init' , numPontos, intervalo, numFregueses)

        const nrodadas = inputs.rodadas;
        let rodadas = [];
        let nqIter = [];
        let r = 0;

        let generator = new ArrivalGenerator(inputs.rho);
        let queue = inputs.disciplina === 'FCFS' ? new FCFSQueue() : new LCFSQueue();
        let server = new ExponentialServer(1);
        let stats = new Stats();

        let currentTime = 0;

        for (let i = 0; i < nrodadas; i++) {
            let arrivals = 0;
            let departures = 0;

            let nextArrival = generator.getNext();
            let queueHead = queue.peek();
            let serverState = server.getState();

            //while (arrivals < 5000) {
            while (departures < 5000) {
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
                    }
                }
                // console.log(departures)
                if((departures+1) % intervalo == 0){
                    foo++;
                }
                if ((((departures+1) % intervalo === 0) && ((departures+1) <= numFregueses * numRodadas))) {
                    console.log('iter ' , cont);
                    nqIter.push(stats.rNq.getAverage(currentTime).toFixed(5));
                    console.log('tam', nqIter.length);
                    cont++;
                    
                }
    
            }
            rodadas.push({
                'metricas': {
                    'rodada':   i,
                    'X_':       stats.rX.getAverage().toFixed(5),
                    'Nq_':      stats.rNq.getAverage(currentTime).toFixed(5),
                    'W_':       stats.rW.getAverage().toFixed(5),
                    'T_':       stats.rT.getAverage().toFixed(5),
                    'Var[X]':   stats.rX.getVariance().toFixed(5),
                    'Var[Nq]':  stats.rNq.getVariance(currentTime).toFixed(5),
                    'Var[W]':   stats.rW.getVariance().toFixed(5),
                    'Var[T]':   stats.rT.getVariance().toFixed(5)
                },
            });
            console.log("arrivals", arrivals);
            console.log("departures", departures);

            stats.nextRound(currentTime);
        }
        let resultado = [];
        resultado.push(rodadas);
        resultado.push(nqIter);
        resultado.push(numPontos);
        resultado.push(numPontos*intervalo);
        console.log('here', nqIter.length);
        console.log(foo)
        console.log(stats.X.getAverage(), stats.W.getAverage(), stats.T.getAverage());

        return resultado;
    }
}