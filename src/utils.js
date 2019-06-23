const seedrandom = require('seedrandom');
const random = seedrandom('leodaocu');

module.exports = {
    getRandomExp: (rate) => {
        return -Math.log(1 - random()) / rate;
    }
}