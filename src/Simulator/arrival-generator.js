const utils = require('../Helpers/utils');

class ArrivalGenerator {
    constructor(rate, distribution = utils.getRandomExp, time = 0) {
        this.rate = rate;
        this.distribution = distribution;
        this.time = time;
    }

    getNext() {
        this.time += this.distribution(this.rate);
        return this.time;
    }
}

module.exports = ArrivalGenerator;
