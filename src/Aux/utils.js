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

    alternate: (values) => {
        let i = -1;
        return (rate) => {
            while (true) {
                i += 1;
                if (i >= values.length) {
                    i = 0;
                }
                return values[i];
            }
        };
    },

    getInverseChiSquaredCDF(probability, degreeOfFreedom) {
        return chi2inv.invChiSquareCDF(probability, degreeOfFreedom);
    }
};
