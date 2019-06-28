const utils = require('../Aux/utils');

class Server {
    constructor(rate, distribution = utils.getRandomExp) {
        this.rate = rate;
        this.distribution = distribution;
        this.exitTime = Infinity;
        this.currentElement = null;
    }

    enter(time, elt) {
        elt.entryTime = time;
        elt.exitTime = time + this.distribution(this.rate);
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

module.exports = Server;
