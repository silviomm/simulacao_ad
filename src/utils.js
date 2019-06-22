const seedrandom = require('seedrandom');
const randomSeed = seedrandom();

module.exports = {
    getRandomExp: (rate) => {
        return -Math.log(1 - randomSeed()) / rate;
    }
}