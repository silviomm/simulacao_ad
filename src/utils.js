const seedrandom = require('seedrandom');
const random = seedrandom('semente');

module.exports = {
    getRandomExp: (rate) => {
        return -Math.log(1 - random()) / rate;
    }
}