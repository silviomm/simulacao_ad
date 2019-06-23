const utils = require('./utils');
const Estimador = require('./estimador');

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
        // chegada para a fila, pula tempo pra chegada
        if (this.currentElement != null) {
            return { status: 'full',
                     exitTime: this.exitTime,    
            };
        } else {
            return { status: 'empty' };
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

function queueToServer(time, queue, server) {
    let elt = queue.get();
    server.enter(time, elt);
}

function arrivalToQueue(time, queue) {
    queue.put({ arrivalTime: time });
}

function exitServer(server) {
    return server.exit();
}

class Stats {
    constructor() {
        this.X = new Estimador();
        this.W = new Estimador();
        this.T = new Estimador();
    }

    fodaSe(elt) {
        this.X.acontece(elt.exitTime - elt.entryTime);
        this.W.acontece(elt.entryTime - elt.arrivalTime);
        this.T.acontece(elt.exitTime - elt.arrivalTime);
    }
}

// elemento: arrivalTime, entryTime, exitTime


let generator = new ArrivalGenerator(0.2);
let queue = new LCFSQueue();
let server = new ExponentialServer(1);
let stats = new Stats();

let currentTime = 0;
let arrival = 0;

let nextArrival = generator.getNext();
let queueHead = queue.peek();
let serverState = server.getState();

console.log(nextArrival, queueHead, serverState);

while (arrival < 50) {
    if (serverState.status == 'empty') {
        if (queueHead) { // se servidor esta vazio, e ha alguem na fila
            console.log("fila pro servidor", );
            queueToServer(currentTime, queue, server);

            queueHead = queue.peek();
            serverState = server.getState();
        } else { // servidor e fila vazios
            console.log("chegada pra fila 1", nextArrival);
            arrivalToQueue(nextArrival, queue);

            currentTime = nextArrival;

            nextArrival = generator.getNext();
            queueHead = queue.peek();

            arrival += 1;
        }
    } else { // servidor ocupado
        if (nextArrival <= serverState.exitTime) {
            console.log("chegada pra fila 2", nextArrival);
            arrivalToQueue(nextArrival, queue);

            currentTime = nextArrival;

            nextArrival = generator.getNext();
            queueHead = queue.peek();
            arrival += 1;
        } else {
            console.log("saida do servidor", serverState.exitTime);
            elt = exitServer(server);

            currentTime = serverState.exitTime;

            stats.fodaSe(elt);

            serverState = server.getState();
        }
    }
}

console.log(stats.X.calculaMedia(), stats.W.calculaMedia(), stats.T.calculaMedia(),
stats.T.calculaMedia() - stats.X.calculaMedia() - stats.W.calculaMedia());