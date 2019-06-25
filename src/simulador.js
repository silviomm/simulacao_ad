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
        this.round = 0;
        this.perRound = [];
        this.resetRoundEstimators(0);

        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new DiscreteEstimator();
    }

    resetRoundEstimators(time) {
        // salvando as metricas de cada rodada antes de resetar(menos no tempo 0 que é a inicialização)
        if (time != 0)
            this.perRound.push({
                'round': this.round,
                'X': {
                    'avg': this.rX.getAverage().toFixed(5),
                    'var': this.rX.getVariance().toFixed(5)
                },
                'W': {
                    'avg': this.rW.getAverage().toFixed(5),
                    'var': this.rW.getVariance().toFixed(5)
                },
                'T': {
                    'avg': this.rT.getAverage().toFixed(5),
                    'var': this.rT.getVariance().toFixed(5)
                },
                'Nq': {
                    'avg': this.rNq.getAverage(time).toFixed(5),
                    'var': this.rNq.getVariance(time).toFixed(5)
                }
            });

        this.rX = new DiscreteEstimator();
        this.rW = new DiscreteEstimator();
        this.rT = new DiscreteEstimator();
        this.rNq = new ContinuousEstimator(time);
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
        this.round += 1;

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
        const nrodadas = inputs.rodadas;
        let rodadas = [];
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
            }
            console.log("arrivals", arrivals);
            console.log("departures", departures);

            stats.nextRound(currentTime);
        }
        
        // média das médias 
        console.log(stats.X.getAverage(), stats.W.getAverage(), stats.T.getAverage());

        return stats;
    }
}