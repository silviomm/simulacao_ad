const utils = require('../Aux/utils');

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

module.exports = ArrivalGenerator;