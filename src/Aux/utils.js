const seedrandom = require('seedrandom');
const chi2inv = require('inv-chisquare-cdf');
const random = seedrandom('semente');

module.exports = {
    getRandomExp: (rate) => {
        return -Math.log(1 - random()) / rate;
    },

    getDeterministic: (rate) => {
        return 1/rate;
    },

    getInverseChiSquaredCDF(probability, degreeOfFreedom) {
        return chi2inv.invChiSquareCDF(probability, degreeOfFreedom);
    }
};
