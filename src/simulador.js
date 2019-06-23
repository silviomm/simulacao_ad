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
        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new ContinuousEstimator();
    }

    fromElement(elt) {
        this.X.sample(elt.exitTime - elt.entryTime);
        this.W.sample(elt.entryTime - elt.arrivalTime);
        this.T.sample(elt.exitTime - elt.arrivalTime);
    }

    updateQueue(time, nq) {
        this.Nq.sample(time, nq);
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

        for (let i = 0; i < nrodadas; i++) {

            let generator = new ArrivalGenerator(inputs.rho);
            let queue = inputs.disciplina === 'FCFS' ? new FCFSQueue() : new LCFSQueue();
            let server = new ExponentialServer(1);
            let stats = new Stats();

            let currentTime = 0;
            let arrival = 0;

            let nextArrival = generator.getNext();
            let queueHead = queue.peek();
            let serverState = server.getState();

            while (arrival < 5000) {
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

                        arrival += 1;
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
                        arrival += 1;
                    } else {
                        //console.log("saida do servidor", serverState.exitTime);
                        elt = exitServer(server);

                        currentTime = serverState.exitTime;

                        stats.fromElement(elt);

                        serverState = server.getState();
                    }
                }
            }
            rodadas.push({
                'metricas': {
                    'rodada': i,
                    'X_': stats.X.getAverage().toFixed(5),
                    'Nq_': stats.Nq.getAverage(currentTime).toFixed(5),
                    'W_': stats.W.getAverage().toFixed(5),
                    'T_': stats.T.getAverage().toFixed(5),
                    'Var[X]': stats.X.getVariance().toFixed(5),
                    'Var[Nq]': stats.Nq.getVariance(currentTime).toFixed(5),
                    'Var[W]': stats.W.getVariance().toFixed(5),
                    'Var[T]': stats.T.getVariance().toFixed(5)
                },
            });
        }
        return rodadas;
    }
}